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
	// 1. 从 JWT 中间件获取用户 ID
	userID, _ := c.Get("userID")

	// 2. 调用 Model 函数
	profile, err := model.GetProfileByUserID(userID.(uint))
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	// 5. 成功响应
	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.SUCCESS.Status,
		"data":    profile,
		"message": errmsg.SUCCESS.Message,
	})
}

// UpdateProfile 更新当前登录用户的个人信息
// @Router /api/v1/register [put]
func UpdateProfile(c *gin.Context) {
	// 1. 从 JWT 中获取用户 ID
	userID, _ := c.Get("userID")

	// 2. 绑定并校验请求体
	var req dto.ReqUpdateProfile
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	// 3. 调用 Model 函数
	err := model.UpdateProfileByUserID(userID.(uint), &req)
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	// 5. 成功响应 - 已优化
	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.UpdateProfileSuccess.Status,
		"message": errmsg.UpdateProfileSuccess.Message,
	})
}
