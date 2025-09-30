package controller

import (
	"goblog/dto"
	"goblog/model"
	"goblog/utils/errmsg"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetProfile 获取当前登录用户的个人信息
// @Router /api/v1/profile [get]
func GetProfile(c *gin.Context) {
	userID, _ := c.Get("userID")

	profile, err := model.GetProfileByUserID(userID.(uint))
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.SUCCESS.Status,
		"data":    profile,
		"message": errmsg.SUCCESS.Message,
	})
}

// UpdateProfile 更新当前登录用户的个人信息
// @Router /api/v1/register [put]
func UpdateProfile(c *gin.Context) {
	userID, _ := c.Get("userID")

	var req dto.ReqUpdateProfile
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	err := model.UpdateProfileByUserID(userID.(uint), &req)
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.UpdateProfileSuccess.Status,
		"message": errmsg.UpdateProfileSuccess.Message,
	})
}
