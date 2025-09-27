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
	// 1. 从表单中获取文件
	file, fileHeader, err := c.Request.FormFile("file")
	if err != nil {
		// --- 已优化：使用预定义变量 ---
		appErr := errmsg.ErrGetFileFailed
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}
	defer file.Close()

	// 3. 调用 model 函数进行上传
	url, err := model.UploadFile(file, fileHeader.Size)
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	// 5. 成功响应 - 已优化
	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.UploadSuccess.Status,
		"data":    dto.RspUpload{Url: url},
		"message": errmsg.UploadSuccess.Message,
	})
}
