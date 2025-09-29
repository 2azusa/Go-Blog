// 文件路径: model/user.go

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
	gorm.Model
	Username string `gorm:"type:varchar(20);not null;unique" json:"username"`
	Password string `gorm:"type:varchar(128);not null" json:"-"`
	Email    string `gorm:"type:varchar(32);not null;unique" json:"email"`
	Role     int    `gorm:"type:int;DEFAULT:2" json:"role"`
	Status   string `gorm:"type:varchar(12);default:'N'" json:"-"`
	Code     string `gorm:"type:varchar(80)" json:"-"`
}

const (
	SaltBytes = 16 // 盐的长度
	HashBytes = 32 // 哈希的长度
)

// BeforeSave 是一个 GORM 钩子，在保存 User 记录前自动执行
func (u *User) BeforeSave(tx *gorm.DB) (err error) {
	if tx.Statement.Changed("Password") {
		hashedPassword, err := HashPassword(u.Password)
		if err != nil {
			return err
		}
		u.Password = hashedPassword
	}
	return nil
}

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

// CreateUser 添加一个新用户，并同时在事务中创建对应的 Profile
func CreateUser(data *User) error {
	return db.Transaction(func(tx *gorm.DB) error {
		// 1. 在事务内检查用户名或邮箱是否已存在
		var existingUser User
		err := tx.Where("username = ? OR email = ?", data.Username, data.Email).First(&existingUser).Error
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}
		if existingUser.ID > 0 {
			if existingUser.Username == data.Username {
				return errmsg.ErrUsernameUsed
			}
			return errmsg.NewAppError(400, 1009, "该邮箱已被注册")
		}

		// 2. 创建 User 记录
		if err := tx.Create(&data).Error; err != nil {
			return err
		}

		// 3. 创建关联的 Profile 记录
		profile := Profile{
			ID:    int(data.ID),
			Name:  data.Username,
			Email: data.Email,
		}
		if err := tx.Create(&profile).Error; err != nil {
			return err
		}
		return nil
	})
}

// CheckUserExists 检查用户名是否已存在
func CheckUserExists(name string) (bool, error) {
	var user User
	err := db.Select("id").Where("username = ?", name).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

// GetUserInfo 查询单个用户的详细信息
func GetUserInfo(id uint) (*User, error) {
	var user User
	err := db.First(&user, id).Error
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
	DB := db.Model(&User{})
	if query != "" {
		DB = DB.Where("username LIKE ?", "%"+query+"%")
	}
	if err := DB.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := DB.Limit(pageSize).Offset((pageNum - 1) * pageSize).Find(&users).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, 0, err
	}
	return users, total, nil
}

// UpdateUserAndProfile 在一个事务中，统一更新用户和其关联的 Profile 信息
func UpdateUserAndProfile(id uint, req *dto.ReqEditUser) error {
	return db.Transaction(func(tx *gorm.DB) error {
		var currentUser User
		if err := tx.First(&currentUser, id).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return errmsg.ErrUserNotExist
			}
			return err
		}

		// 如果用户名被修改，检查新用户名是否与除自己以外的其他用户冲突
		if currentUser.Username != req.Username {
			var conflictUser User
			err := tx.Where("username = ? AND id != ?", req.Username, id).First(&conflictUser).Error
			if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
				return err // 查询时出错
			}
			if conflictUser.ID > 0 {
				return errmsg.ErrUsernameUsed // 新名称已被其他用户使用
			}
		}

		userUpdates := map[string]interface{}{"username": req.Username, "email": req.Email, "role": req.Role}
		if err := tx.Model(&User{}).Where("id = ?", id).Updates(userUpdates).Error; err != nil {
			return err
		}
		profileUpdates := map[string]interface{}{"name": req.Username, "email": req.Email}
		if err := tx.Model(&Profile{}).Where("id = ?", id).Updates(profileUpdates).Error; err != nil {
			return err
		}
		return nil
	})
}

// DeleteUser 在一个事务中，删除用户及其关联的 Profile 和中间表记录
func DeleteUser(id uint) error {
	return db.Transaction(func(tx *gorm.DB) error {
		// 检查用户是否存在
		if err := tx.First(&User{}, id).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return errmsg.ErrUserNotExist
			}
			return err
		}

		// 删除 user_article 中间表关联
		if err := tx.Where("user_id = ?", id).Delete(&UserArticle{}).Error; err != nil {
			return err
		}

		// 删除 Profile
		if err := tx.Where("id = ?", id).Delete(&Profile{}).Error; err != nil {
			return err
		}

		// 删除 User
		if err := tx.Delete(&User{}, id).Error; err != nil {
			return err
		}

		return nil
	})
}

// CheckLogin 验证用户名和密码，用于登录
func CheckLogin(username string, password string) (*User, error) {
	var user User
	err := db.Where("username = ?", username).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errmsg.ErrUserNotExist
		}
		return nil, err
	}
	if user.Status == "N" {
		return nil, errmsg.ErrEmailNotActive
	}
	passwordMatch, err := CheckPassword(user.Password, password)
	if err != nil {
		return nil, err
	}
	if !passwordMatch {
		return nil, errmsg.ErrPasswordWrong
	}
	return &user, nil
}

// FindUserByName 通过用户名查找用户 (JWT 中间件会用到)
func FindUserByName(name string) (*User, error) {
	var user User
	err := db.Where("username = ?", name).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errmsg.ErrUserNotExist
		}
		return nil, err
	}
	return &user, nil
}

// GetUserByEmail 通过邮箱地址查找用户 (邮箱登录会用到)
func GetUserByEmail(email string) (*User, error) {
	var user User
	err := db.Where("email = ?", email).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errmsg.ErrUserNotExist
		}
		return nil, err
	}
	return &user, nil
}
