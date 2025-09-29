package model

import (
	"errors"
	"goblog/dto"
	"goblog/utils/errmsg" // 引入 errmsg 包

	"gorm.io/gorm"
)

type Profile struct {
	ID     int    `gorm:"primaryKey" json:"id"`
	Name   string `gorm:"type:varchar(50)" json:"name"`
	Desc   string `gorm:"type:varchar(200)" json:"desc"`
	WeChat string `gorm:"type:varchar(50)" json:"wechat"`
	Weibo  string `gorm:"type:varchar(50)" json:"weibo"`
	Email  string `gorm:"type:varchar(32)" json:"email"`
	Img    string `gorm:"type:varchar(255)" json:"img"`
	Avatar string `gorm:"type:varchar(255)" json:"avatar"`
}

// GetProfileByUserID 根据用户ID获取个人信息
func GetProfileByUserID(userID uint) (*Profile, error) {
	var profile Profile
	err := db.First(&profile, userID).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 返回预定义的业务错误，而不是通用的 gorm 错误
			return nil, errmsg.ErrUserNotExist
		}
		return nil, err // 其他数据库错误直接返回
	}
	return &profile, nil
}

// UpdateProfileByUserID 根据用户ID更新个人信息
func UpdateProfileByUserID(userID uint, req *dto.ReqUpdateProfile) error {
	// 使用 map 来更新，这是一种常见的安全做法
	updates := map[string]any{
		"name":   req.Name,
		"desc":   req.Desc,
		"wechat": req.WeChat, // 注意数据库蛇形命名与 struct 字段的映射
		"weibo":  req.Weibo,
		"img":    req.Img,
		"avatar": req.Avatar,
	}

	result := db.Model(&Profile{}).Where("id = ?", userID).Updates(updates)
	if result.Error != nil {
		return result.Error
	}

	// 如果更新影响的行数为0，说明该 Profile 不存在
	if result.RowsAffected == 0 {
		return errmsg.ErrUserNotExist
	}
	return nil
}

// CreateProfile 新建个人信息 (在用户注册时调用)
func CreateProfile(profile *Profile) error {
	return db.Create(profile).Error
}
