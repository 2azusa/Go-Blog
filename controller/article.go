package controller

import (
	"goblog/dto"
	"goblog/model"
	"goblog/utils/errmsg"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// 添加文章
func AddArticle(c *gin.Context) {
	var data model.Article
	var userArticle model.UserArticle
	_ = c.ShouldBind(&data)
	code := model.CreateArticle(&data)

	userArticle.ArticleId = data.ID

	userName, _ := c.Get("username")
	userArticle.UserId = model.FindUserByName(userName)
	_ = model.CreateUserArticle(&userArticle)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}

// 添加评论
func AddComment(c *gin.Context) {
	var data model.Comment
	_ = c.ShouldBindJSON(&data)
	id := data.ArticleID

	code := model.CreateComment(id, data)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}

// 删除评论
func DeleteComment(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	code := model.DeleteComment(id)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}

// 查询单个文章
func GetArticleInfo(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	data, code := model.GetArticleInfo(id)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}

// 查询文章下的所有评论
func GetCommetns(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	data, code := model.GetCommentsByArticleId(id)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}

// 根据分类查询所有文章
func GetCateArticle(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	pageNum, _ := strconv.Atoi(c.Query("pagenum"))
	pageSize, _ := strconv.Atoi(c.Query("pagesize"))

	if pageNum == 0 {
		pageNum = -1
	}
	if pageSize == 0 {
		pageSize = -1
	}

	data, code, total := model.GetCateArticle(id, pageSize, pageNum)
	articles := make([]*dto.RspFindArticle, 0)
	for i := range data {
		article := &dto.RspFindArticle{
			ID:        data[i].ID,
			Title:     data[i].Title,
			CreatedAt: data[i].CreatedAt,
			Desc:      data[i].Desc,
			Content:   data[i].Content,
			Img:       data[i].Img,
		}
		Cate, err := model.FindCategoryById(data[i].Cid)
		if err != nil {
			article.Name = ""
		} else {
			article.Name = Cate.Name
		}
		articles = append(articles, article)
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    articles,
		"total":   total,
		"message": errmsg.GetErrMsg(code),
	})
}

// 查询文章列表
func GetArticle(c *gin.Context) {
	var req dto.ReqFindArticle
	_ = c.ShouldBindJSON(&req)

	if req.PageSize == 0 {
		req.PageSize = -1
	}
	if req.PageSize == 0 {
		req.PageSize = -1
	}
	data, code, total := model.GetArticles(req.Title, req.PageSize, req.PageNum)

	articles := make([]*dto.RspFindArticle, 0)
	for i := range data {
		article := &dto.RspFindArticle{
			ID:        data[i].ID,
			Title:     data[i].Title,
			CreatedAt: data[i].CreatedAt,
			Desc:      data[i].Desc,
			Content:   data[i].Content,
			Img:       data[i].Img,
		}
		Cate, err := model.FindCategoryById(data[i].Cid)
		if err != nil {
			article.Name = ""
		} else {
			article.Name = Cate.Name
		}
		articles = append(articles, article)
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    articles,
		"total":   total,
		"message": errmsg.GetErrMsg(code),
	})
}

// 编辑文章
func EditArticle(c *gin.Context) {
	var data model.Article
	id, _ := strconv.Atoi(c.Param("id"))
	_ = c.ShouldBindJSON(&data)

	code := model.EditArticle(id, &data)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}

// 删除文章
func DeleteArticle(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	code := model.DeleteArticle(id)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}
