package model

import (
	"errors"
	"goblog/dto"
	"goblog/utils/errmsg"

	"gorm.io/gorm"
)

type Profile struct {
	UserId uint   `gorm:"not null;unique" json:"user_id"`
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
			return nil, errmsg.ErrUserNotExist
		}
		return nil, err
	}
	return &profile, nil
}

// UpdateProfileByUserID 根据用户ID更新个人信息
func UpdateProfileByUserID(userID uint, req *dto.ReqUpdateProfile) error {
	updates := map[string]any{
		"name":   req.Name,
		"desc":   req.Desc,
		"wechat": req.WeChat,
		"weibo":  req.Weibo,
		"img":    req.Img,
		"avatar": req.Avatar,
	}

	result := db.Model(&Profile{}).Where("user_id = ?", userID).Updates(updates)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errmsg.ErrUserNotExist
	}
	return nil
}
