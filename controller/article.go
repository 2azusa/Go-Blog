package controller

import (
	"goblog/dto"
	"goblog/model"
	"goblog/utils/errmsg"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// AddArticle 添加文章
// @Router /api/v1/articles [post]
func AddArticle(c *gin.Context) {
	var req dto.ReqArticle
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	newArticle := &model.Article{
		Title:   req.Title,
		Cid:     req.Cid,
		Desc:    req.Desc,
		Content: req.Content,
		Img:     req.Img,
	}

	if err := model.CreateArticle(newArticle); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.CreateArticleSuccess.Status,
		"message": errmsg.CreateArticleSuccess.Message,
	})
}

// GetArticleInfo 获取单个文章详细信息
// @Router /api/v1/articles/{id} [get]
func GetArticleInfo(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 0)
	if err != nil {
		appErr := errmsg.ErrInvalidArticleID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	article, err := model.GetArticleInfo(uint(id))
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.SUCCESS.Status,
		"data":    article,
		"message": errmsg.SUCCESS.Message,
	})
}

// GetArticle 查询文章列表
// @Router /api/v1/articles [get]
func GetArticle(c *gin.Context) {
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

	articles, total, err := model.GetArticles(req.Title, req.PageSize, req.PageNum)
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

// EditArticle 编辑文章
// @Router /api/v1/articles/{id} [put]
func EditArticle(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 0)
	if err != nil {
		appErr := errmsg.ErrInvalidArticleID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	var req dto.ReqArticle
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	articleToUpdate := &model.Article{
		Title:   req.Title,
		Cid:     req.Cid,
		Desc:    req.Desc,
		Content: req.Content,
		Img:     req.Img,
	}

	if err := model.EditArticle(uint(id), articleToUpdate); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.UpdateArticleSuccess.Status,
		"message": errmsg.UpdateArticleSuccess.Message,
	})
}

// DeleteArticle 删除文章
// @Router /api/v1/articles/{id} [delete]
func DeleteArticle(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 0)
	if err != nil {
		appErr := errmsg.ErrInvalidArticleID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	if err := model.DeleteArticle(uint(id)); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.DeleteArticleSuccess.Status,
		"message": errmsg.DeleteArticleSuccess.Message,
	})
}

// GetCommentsByArticleId 获取文章下的所有评论
// @Router /api/v1/articles/{id}/comments [get]
func GetCommentsByArticleId(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 0)
	if err != nil {
		appErr := errmsg.ErrInvalidArticleID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	comments, err := model.GetCommentsByArticleId(uint(id))
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.SUCCESS.Status,
		"data":    comments,
		"message": errmsg.SUCCESS.Message,
	})
}

// AddComment 添加评论
// @Router /api/v1/articles/{id}/comments [post]
func AddComment(c *gin.Context) {
	id, err := strconv.ParseUint((c.Param("id")), 10, 0)
	if err != nil {
		appErr := errmsg.ErrInvalidArticleID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}
	articleId := uint(id)

	var req dto.ReqAddComment
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	newComment := &model.Comment{
		Content: req.Content,
	}

	if err := model.CreateComment(articleId, newComment); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.AddCommentSuccess.Status,
		"message": errmsg.AddCommentSuccess.Message,
	})
}

// DeleteComment 删除评论
// @Router /api/v1/comments/{id} [delete]
func DeleteComment(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 0)
	if err != nil {
		appErr := errmsg.ErrInvalidCommentID
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	if err := model.DeleteComment(uint(id)); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.DeleteCommentSuccess.Status,
		"message": errmsg.DeleteCommentSuccess.Message,
	})
}
