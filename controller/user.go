package controller

import (
	"goblog/dto"
	"goblog/model"
	"goblog/utils/errmsg"
	"goblog/utils/validator"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// AddUser 添加新用户
// @Router /api/v1/users/add [post]
func AddUser(c *gin.Context) {
	var req dto.ReqAddUser
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}
	if err := validator.Validate(&req); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	newUser := &model.User{
		Username: req.Username,
		Password: req.Password,
		Email:    req.Email,
		Role:     req.Role,
		Status:   "Y",
	}

	if err := model.CreateUser(newUser); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.AddUserSuccess.Status,
		"message": errmsg.AddUserSuccess.Message,
	})
}

// GetUser 获取用户列表
// @Router /api/v1/users [get]
func GetUser(c *gin.Context) {
	var req dto.ReqFindUser
	if err := c.ShouldBindQuery(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	if req.PageSize <= 0 {
		req.PageSize = 10
	}
	if req.PageNum <= 0 {
		req.PageNum = 1
	}

	users, total, err := model.GetUsers(req.Query, req.PageSize, req.PageNum)
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	var rspUsers []dto.RspUser
	for _, user := range users {
		rspUsers = append(rspUsers, dto.RspUser{
			ID:        user.ID,
			CreatedAt: user.CreatedAt,
			Username:  user.Username,
			Email:     user.Email,
			Role:      user.Role,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.SUCCESS.Status,
		"data":    rspUsers,
		"total":   total,
		"message": errmsg.SUCCESS.Message,
	})
}

// GetUserInfo 获取单个用户详细信息
// @Router /api/v1/users/{id} [get]
func GetUserInfo(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 0)
	if err != nil {
		appErr := errmsg.ErrInvalidUserID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	user, err := model.GetUserInfo(uint(id))
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": errmsg.SUCCESS.Status,
		"data": dto.RspUser{
			ID:        user.ID,
			CreatedAt: user.CreatedAt,
			Username:  user.Username,
			Email:     user.Email,
			Role:      user.Role,
		},
		"message": errmsg.SUCCESS.Message,
	})
}

// EditUser 编辑用户信息
// @Router /api/v1/users/{id} [put]
func EditUser(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 0)
	if err != nil {
		appErr := errmsg.ErrInvalidUserID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	var req dto.ReqEditUser
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	err = model.UpdateUserAndProfile(uint(id), &req)
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.UpdateUserSuccess.Status,
		"message": errmsg.UpdateUserSuccess.Message,
	})
}

// DeleteUser 删除用户
// @Router /api/v1/users/{id} [delete]
func DeleteUser(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 0)
	if err != nil {
		appErr := errmsg.ErrInvalidUserID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	err = model.DeleteUser(uint(id))
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.DeleteUserSuccess.Status,
		"message": errmsg.DeleteUserSuccess.Message,
	})
}
