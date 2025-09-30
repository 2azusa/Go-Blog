package model

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"goblog/dto"
	"goblog/utils/errmsg"
	"io"
	"strings"

	"golang.org/x/crypto/scrypt"
	"gorm.io/gorm"
)

type User struct {
	BaseModel
	Username string  `gorm:"type:varchar(20);not null;uniqueIndex" json:"username"`
	Password string  `gorm:"type:varchar(128);not null" json:"-"`
	Email    string  `gorm:"type:varchar(32);not null;uniqueIndex" json:"email"`
	Role     int     `gorm:"type:int;DEFAULT:2" json:"role"`
	Status   string  `gorm:"type:varchar(12);default:'N'" json:"-"`
	Code     string  `gorm:"type:varchar(80)" json:"-"`
	Profile  Profile `gorm:"foreignKey:UserID" json:"profile"`
}

const (
	SaltBytes = 16 // 盐的长度
	HashBytes = 32 // 哈希的长度
)

// // BeforeUpdate 是一个 GORM 钩子，在更新 User 记录前自动执行
// func (u *User) BeforeUpdate(tx *gorm.DB) (err error) {
// 	// 仅当 Password 字段被明确修改时才执行哈希
// 	if tx.Statement.Changed("Password") {
// 		hashedPassword, err := HashPassword(u.Password)
// 		if err != nil {
// 			return err
// 		}
// 		u.Password = hashedPassword
// 	}
// 	return nil
// }

// HashPassword 使用 scrypt 算法对密码进行哈希
func HashPassword(password string) (string, error) {
	salt := make([]byte, SaltBytes)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return "", err
	}
	hash, err := scrypt.Key([]byte(password), salt, 16384, 8, 1, HashBytes)
	if err != nil {
		return "", err
	}
	encodedSalt := base64.StdEncoding.EncodeToString(salt)
	encodedHash := base64.StdEncoding.EncodeToString(hash)
	return fmt.Sprintf("%s$%s", encodedSalt, encodedHash), nil
}

// CheckPassword 验证提供的密码是否与存储的哈希密码匹配
func CheckPassword(storedPassword, providedPassword string) (bool, error) {
	parts := strings.Split(storedPassword, "$")
	if len(parts) != 2 {
		return false, errmsg.ErrInternalServer.WithMsg("存储的密码格式无效")
	}
	salt, err := base64.StdEncoding.DecodeString(parts[0])
	if err != nil {
		return false, errmsg.ErrInternalServer.WithMsg("无法解析密码盐")
	}
	hash, err := scrypt.Key([]byte(providedPassword), salt, 16384, 8, 1, HashBytes)
	if err != nil {
		return false, err
	}
	return base64.StdEncoding.EncodeToString(hash) == parts[1], nil
}

// isUserExist 检查用户名或邮箱是否已存在 (内部函数)
func isUserExist(tx *gorm.DB, username, email string) error {
	var existingUser User
	err := tx.Where("username = ? OR email = ?", username, email).First(&existingUser).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}
	if existingUser.ID > 0 {
		if existingUser.Username == username {
			return errmsg.ErrUsernameUsed
		}
		return errmsg.NewAppError(400, 1009, "该邮箱已被注册")
	}
	return nil
}

// CreateUser 添加一个新用户，并同时在事务中创建对应的 Profile
func CreateUser(data *User) error {
	return db.Transaction(func(tx *gorm.DB) error {
		if err := isUserExist(tx, data.Username, data.Email); err != nil {
			return err
		}

		hashedPassword, err := HashPassword(data.Password)
		if err != nil {
			return err
		}
		data.Password = hashedPassword

		data.Profile = Profile{
			Name:  data.Username,
			Email: data.Email,
		}
		if err := tx.Create(data).Error; err != nil {
			return err
		}
		return nil
	})
}

// GetUserInfo 查询单个用户的详细信息
func GetUserInfo(id uint) (*User, error) {
	var user User
	err := db.Preload("Profile").First(&user, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errmsg.ErrUserNotExist
		}
		return nil, err
	}
	return &user, nil
}

// GetUsers 分页查询用户列表
func GetUsers(query string, pageSize int, pageNum int) ([]User, int64, error) {
	var users []User
	var total int64
	DB := db.Model(&User{}).Preload("Profile")
	if query != "" {
		DB = DB.Where("username LIKE ?", "%"+query+"%")
	}
	err := DB.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	err = DB.Limit(pageSize).Offset((pageNum - 1) * pageSize).Order("id desc").Find(&users).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, 0, err
	}
	return users, total, nil
}

// UpdateUserAndProfile 在一个事务中，统一更新用户和其关联的 Profile 信息
func UpdateUserAndProfile(id uint, req *dto.ReqEditUser) error {
	return db.Transaction(func(tx *gorm.DB) error {
		var conflictUser User
		err := tx.Where("username = ? AND id != ?", req.Username, id).First(&conflictUser).Error
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}
		if conflictUser.ID > 0 {
			return errmsg.ErrUsernameUsed
		}
		err = tx.Where("email = ? AND id != ?", req.Email, id).First(&conflictUser).Error
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}
		if conflictUser.ID > 0 {
			return errmsg.NewAppError(400, 1009, "该邮箱已被其他用户注册")
		}

		userUpdates := map[string]any{"username": req.Username, "email": req.Email, "role": req.Role}
		if err := tx.Model(&User{}).Where("id = ?", id).Updates(userUpdates).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return errmsg.ErrUserNotExist
			}
			return err
		}
		profileUpdates := map[string]any{"name": req.Username, "email": req.Email}
		if err := tx.Model(&Profile{}).Where("user_id = ?", id).Updates(profileUpdates).Error; err != nil {
			return err
		}
		return nil
	})
}

// DeleteUser 在一个事务中，删除用户及其关联的所有数据
func DeleteUser(id uint) error {
	return db.Transaction(func(tx *gorm.DB) error {
		var user User
		if err := tx.First(&user, id).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return errmsg.ErrUserNotExist
			}
			return err
		}
		if err := tx.Where("user_id = ?", id).Delete(&Profile{}).Error; err != nil {
			return err
		}
		if err := tx.Where("user_id = ?", id).Delete(&UserArticle{}).Error; err != nil {
			return err
		}
		if err := tx.Delete(&user).Error; err != nil {
			return err
		}
		return nil
	})
}
