package controller

import (
	"goblog/dto"
	"goblog/model"
	"goblog/utils/errmsg"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// 查询用户详细资料
func GetUserInfo(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	data, code := model.GetUserInfo(id)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}

// 查询用户列表
func GetUser(c *gin.Context) {
	var req dto.ReqFindUser
	_ = c.ShouldBindJSON(&req)

	if req.PageSize == 0 {
		req.PageSize = -1
	}
	if req.PageNum == 0 {
		req.PageNum = -1
	}
	data, total, err := model.GetUsers(req.IdOrName, req.PageSize, req.PageNum)
	code := errmsg.SUCCESS
	if err != nil {
		code = errmsg.ERROR
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"total":   total,
		"message": errmsg.GetErrMsg(code),
	})
}

// 添加用户
func AddUser(c *gin.Context) {
	var data dto.ReqAddUser
	_ = c.ShouldBindJSON(&data)

	code := model.CheckUser(data.UserName)
	if code == errmsg.SUCCESS {
		user := &model.User{
			Username: data.UserName,
			Password: data.Password,
			Email:    data.Email,
			Role:     data.Role,
			Status:   "Y",
		}
		result, _ := model.CreateUser(user)
		profile := &model.Profile{
			ID:    int(result.ID),
			Name:  result.Username,
			Email: result.Email,
		}
		code = model.CreateProfile(profile)
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}

// 编辑用户
func EditUser(c *gin.Context) {
	var req dto.ReqEditUser
	var code int
	_ = c.ShouldBindJSON(&req)

	user, _ := model.GetUserInfo(req.Id)
	if user.Username != req.UserName {
		code = model.CheckUser(req.UserName)
		if code != errmsg.SUCCESS {
			c.JSON(code, gin.H{
				"status":  code,
				"message": errmsg.GetErrMsg(code),
			})
			return
		}
	}

	code = model.EditUser(req.Id, &req)
	if code != errmsg.SUCCESS {
		c.JSON(http.StatusOK, gin.H{
			"status":  code,
			"message": errmsg.GetErrMsg(code),
		})
		return
	}

	profileOld, _ := model.GetProfileById(req.Id)
	profile := &model.Profile{
		ID:     req.Id,
		Name:   req.UserName,
		Email:  req.Email,
		Desc:   profileOld.Desc,
		WeChat: profileOld.WeChat,
		Weibo:  profileOld.Weibo,
		Img:    profileOld.Img,
		Avatar: profileOld.Avatar,
	}
	code = model.UpdateProfile(c, profile.ID, profile)
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}

// 删除用户
func DeleteUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	code := model.DeleteUser(id)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}
