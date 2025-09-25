package controller

import (
	"goblog/dto"
	"goblog/model"
	"goblog/utils/errmsg"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// 添加分类
func AddCategory(c *gin.Context) {
	var data model.Category
	_ = c.ShouldBind(&data)
	// 判断分类是否存在
	code := model.CheckCategory(data.Name)
	if code == errmsg.SUCCESS {
		code = model.CreateCategory(&data)
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}

// 查询分类列表
func GetCategory(c *gin.Context) {
	var code int
	var req dto.ReqCommon
	_ = c.ShouldBind(&req)
	// 如果pageSize等于0,则取消分页
	if req.PageSize == 0 {
		req.PageSize = -1
	}
	if req.PageNum == 0 {
		req.PageNum = -1
	}
	// 查看所有类别
	data, total, err := model.GetCategory(req.PageSize, req.PageNum)
	if err != nil {
		code = errmsg.ERROR
	} else {
		code = errmsg.SUCCESS
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"total":   total,
		"message": errmsg.GetErrMsg(code),
	})
}

// 编辑分类名
func EditCategory(c *gin.Context) {
	var data model.Category
	// 获取参数
	id, _ := strconv.Atoi(c.Param("id"))
	_ = c.ShouldBindJSON(&data)
	code := model.CheckCategory(data.Name)
	if code == errmsg.SUCCESS {
		code = model.EditCategory(id, &data)
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}

// 删除分类
func DeleteCategory(c *gin.Context) {
	// 获取参数
	id, _ := strconv.Atoi(c.Param("id"))
	// 调用删除的函数
	code := model.DeleteCategory(id)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}

// 通过id查找分类
func FindCategoryById(c *gin.Context) {
	var code int
	// 获取参数
	id, _ := strconv.Atoi(c.Param("id"))
	// 调用删除的函数
	cate, err := model.FindCategoryById(id)
	if err != nil {
		code = errmsg.ERROR
	} else {
		code = errmsg.SUCCESS
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    cate,
		"message": errmsg.GetErrMsg(code),
	})
}
