package model

import (
	"errors"
	"fmt"
	"goblog/utils"
	"goblog/utils/errmsg"
	"time"

	"gorm.io/gorm"
)

// --- 注册与激活 ---

// RegisterUser 在一个事务中处理完整的用户注册流程
func RegisterUser(data *User) error {
	activationLinkTpl := "http://localhost%s/api/v1/active?code=%s"

	return db.Transaction(func(tx *gorm.DB) error {
		if err := isUserExist(tx, data.Username, data.Email); err != nil {
			return err
		}

		hashedPassword, err := HashPassword(data.Password)
		if err != nil {
			return err
		}
		data.Password = hashedPassword

		data.Code = utils.CreateUUID()

		data.Profile = Profile{
			Name:  data.Username,
			Email: data.Email,
		}
		if err := tx.Create(data).Error; err != nil {
			return err
		}

		activationLink := fmt.Sprintf(activationLinkTpl, utils.HttpPort, data.Code)
		emailBody := fmt.Sprintf("<h2>欢迎来到 GoBlog!</h2><p>请点击以下链接激活您的账户:</p><a href='%s'>激活账户</a>", activationLink)

		if err := SendEmail(data.Email, "GoBlog 账户激活", emailBody); err != nil {
			return err
		}

		return nil
	})
}

// ActivateUserByCode 根据激活码查找用户并更新其状态
func ActivateUserByCode(code string) error {
	var user User
	err := db.Where("code = ? AND status = ?", code, "N").First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errmsg.ErrEmailCodeNotExist
		}
		return err
	}

	updates := map[string]any{"status": "Y", "code": ""}
	return db.Model(&user).Updates(updates).Error
}

// --- 登录验证 ---

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
	if user.Status != "Y" {
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

// todo
func CheckAdminLogin(username string, password string) (*User, error) {
	var user User
	err := db.Where("username = ?", username).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errmsg.ErrUserNotExist
		}
		return nil, err
	}
	if user.Status != "Y" {
		return nil, errmsg.ErrEmailNotActive
	}
	if user.Role != 1 {
		return nil, errmsg.ErrNoAdminPermission
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

// SendVerificationCode 生成验证码，存入 Redis 并通过邮件发送
func SendVerificationCode(email string) error {
	code := utils.CreateVcode()
	emailBody := fmt.Sprintf("<h2>GoBlog 登录</h2><p>您的验证码是: <b style='color:blue;'>%s</b></p><p>此验证码 5 分钟内有效。</p>", code)

	err := Redis.Set(ctx, email, code, 5*time.Minute).Err()
	if err != nil {
		return errmsg.ErrInternalServer.WithMsg("无法将验证码存入 Redis: %v", err)
	}

	return SendEmail(email, "您的 GoBlog 验证码", emailBody)
}

// CheckLoginByEmail 验证验证码并获取用户信息
func CheckLoginByEmail(email, userCode string) (*User, error) {
	serverCode, err := Redis.Get(ctx, email).Result()
	if err != nil {
		return nil, errmsg.ErrCodeWrong.WithMsg("验证码已过期或无效。")
	}

	if serverCode != userCode {
		return nil, errmsg.ErrCodeWrong
	}

	user, err := GetUserByEmail(email)
	if err != nil {
		return nil, err
	}

	if user.Status != "Y" {
		return nil, errmsg.ErrEmailNotActive
	}

	Redis.Del(ctx, email)
	return user, nil
}

// --- 用户查找 (认证相关) ---

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

// GetUserByEmail 通过邮箱地址查找用户 (邮箱登录/注册/找回密码等场景会用到)
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
