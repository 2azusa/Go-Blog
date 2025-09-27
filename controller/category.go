// 文件路径: controller/category.go

package controller

import (
	"goblog/dto"
	"goblog/model"
	"goblog/utils/errmsg"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetCategory 查询分类列表
// @Router /api/v1/categories [get]
func GetCategory(c *gin.Context) {
	var req dto.ReqFindCate
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

	categories, total, err := model.GetCategory(req.PageSize, req.PageNum)
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.SUCCESS.Status,
		"data":    categories,
		"total":   total,
		"message": errmsg.SUCCESS.Message,
	})
}

// AddCategory 添加分类
// @Router /api/v1/categories [post]
func AddCategory(c *gin.Context) {
	var req dto.ReqCategory
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	newCategory := &model.Category{
		Name: req.Name,
	}

	if err := model.CreateCategory(newCategory); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.CreateCategorySuccess.Status,
		"data":    newCategory,
		"message": errmsg.CreateCategorySuccess.Message,
	})
}

// EditCategory 编辑分类名
// @Router /api/v1/categories/{id} [put]
func EditCategory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 0)
	if err != nil {
		appErr := errmsg.ErrInvalidCategoryID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	var req dto.ReqCategory
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	categoryToUpdate := &model.Category{
		Name: req.Name,
	}

	if err := model.EditCategory(uint(id), categoryToUpdate); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.UpdateCategorySuccess.Status,
		"message": errmsg.UpdateCategorySuccess.Message,
	})
}

// DeleteCategory 删除分类
// @Router /api/v1/categories/{id} [delete]
func DeleteCategory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 0)
	if err != nil {
		// --- 已优化：使用预定义变量 ---
		appErr := errmsg.ErrInvalidCategoryID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	if err := model.DeleteCategory(uint(id)); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.DeleteCategorySuccess.Status,
		"message": errmsg.DeleteCategorySuccess.Message,
	})
}

// FindCategoryById 通过id查找分类
// @Router /api/v1/categories/{id} [get]
func FindCategoryById(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 0)
	if err != nil {
		appErr := errmsg.ErrInvalidCategoryID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	category, err := model.FindCategoryById(uint(id))
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.SUCCESS.Status,
		"data":    category,
		"message": errmsg.SUCCESS.Message,
	})
}

// GetCateArticle 根据分类查询所有文章
// @Router /api/v1/categories/{id}/articles [get]
func GetCateArticle(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		appErr := errmsg.ErrInvalidCategoryID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	var req dto.ReqFindArticle
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

	articles, total, err := model.GetCateArticle(id, req.PageSize, req.PageNum)
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.SUCCESS.Status,
		"data":    articles,
		"total":   total,
		"message": errmsg.SUCCESS.Message,
	})
}
