package controller

import (
	"goblog/model"
	"goblog/utils/errmsg"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProfile(c *gin.Context) {
	profile, code := model.GetProfile(c)
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    profile,
		"message": errmsg.GetErrMsg(code),
	})
}

func UpdateProfile(c *gin.Context) {
	var req model.Profile
	_ = c.ShouldBindJSON(&req)

	profile, code := model.GetProfile(c)
	if code != errmsg.SUCCESS {
		c.JSON(http.StatusOK, gin.H{
			"staust":  code,
			"message": errmsg.GetErrMsg(code),
		})
		return
	}

	req.ID = profile.ID
	code = model.UpdateProfile(c, req.ID, &req)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}
