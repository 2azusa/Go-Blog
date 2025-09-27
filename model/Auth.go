// 文件路径: model/auth.go

package model

import (
	"errors"
	"fmt"
	"goblog/utils"
	"goblog/utils/errmsg"
	"time"

	"gorm.io/gorm"
)

// var ctx = context.Background()

// RegisterUser 在一个事务中处理完整的用户注册流程
func RegisterUser(data *User) error {
	return db.Transaction(func(tx *gorm.DB) error {
		// 1. 检查用户名或邮箱是否已存在
		var existingUser User
		err := tx.Where("username = ? OR email = ?", data.Username, data.Email).First(&existingUser).Error
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err // 数据库查询错误
		}
		if existingUser.ID > 0 {
			if existingUser.Username == data.Username {
				return errmsg.ErrUsernameUsed
			}
			// 您可以为邮箱已存在创建一个新的错误类型，比如 ErrEmailUsed
			return errmsg.NewAppError(400, 1009, "该邮箱已被注册")
		}

		// 2. 准备用户数据
		data.Code = utils.CreateUUID()
		data.Status = "N" // 未激活
		// 密码哈希由 User模型的 BeforeSave 钩子自动处理

		if err := tx.Create(&data).Error; err != nil {
			return err
		}

		// 3. 发送激活邮件
		activationLink := fmt.Sprintf("http://localhost%s/api/v1/active?code=%s", utils.HttpPort, data.Code)
		emailBody := fmt.Sprintf("<h2>欢迎来到 GoBlog!</h2><p>请点击以下链接激活您的账户:</p><a href='%s'>激活账户</a>", activationLink)

		if err := SendEmail(data.Email, "GoBlog 账户激活", emailBody); err != nil {
			// 如果邮件发送失败，事务将回滚，用户不会被创建
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

	// 激活用户：更新状态并清除激活码
	updates := map[string]interface{}{"status": "A", "code": ""}
	return db.Model(&user).Updates(updates).Error
}

// SendVerificationCode 生成验证码，存入 Redis 并通过邮件发送
func SendVerificationCode(email string) error {
	code := utils.CreateVcode() // e.g., "123456"
	emailBody := fmt.Sprintf("<h2>GoBlog 登录</h2><p>您的验证码是: <b style='color:blue;'>%s</b></p><p>此验证码 5 分钟内有效。</p>", code)

	// 将验证码存入 Redis，并设置 5 分钟有效期
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

	// 验证码正确，查找用户
	user, err := GetUserByEmail(email)
	if err != nil {
		return nil, err
	}

	// 登录成功，删除验证码防止重复使用
	Redis.Del(ctx, email)

	return user, nil
}
