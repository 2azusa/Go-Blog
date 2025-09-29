package controller

import (
	"goblog/dto"
	"goblog/model"
	"goblog/utils/errmsg"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Upload 处理文件上传请求
// @Router /api/v1/upload [post]
func Upload(c *gin.Context) {
	file, fileHeader, err := c.Request.FormFile("file")
	if err != nil {
		appErr := errmsg.ErrGetFileFailed
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}
	defer file.Close()

	url, err := model.UploadFile(file, fileHeader.Size)
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.UploadSuccess.Status,
		"data":    dto.RspUpload{Url: url},
		"message": errmsg.UploadSuccess.Message,
	})
}
