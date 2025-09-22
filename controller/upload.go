package controller

import (
	"goblog/model"
	"goblog/utils/errmsg"
	"net/http"

	"github.com/gin-gonic/gin"
)

// 上传文件
func Upload(c *gin.Context) {
	file, fileHeadr, _ := c.Request.FormFile("file")

	fileSize := fileHeadr.Size

	url, code := model.UploadFile(file, fileSize)
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
		"url":     url,
	})
}
