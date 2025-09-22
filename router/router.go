package router

import (
	"goblog/controller"
	"goblog/middleware"
	"goblog/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitRouter() {
	gin.SetMode(utils.AppMode)
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.Logger())
	r.Use(middleware.Cors())

	// 后台管理的页面加载
	r.LoadHTMLGlob("static/admin/index.html")
	r.Static("admin/static", "static/admin/static")
	r.StaticFile("admin/favicon.ico", "static/admin/favicon.ico")
	r.GET("admin", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	// 前台展示的的页面加载
	// r.LoadHTMLGlob("static/front/index.html")
	// r.Static("front/static", "static/front/static")
	// r.StaticFile("front/favicon.ico", "static/front/favicon.ico")
	// r.GET("front", func(c *gin.Context) {
	// 	c.HTML(http.StatusOK, "index.html", nil)
	// })

	// 设置中间件，以下操作需要权限
	auth := r.Group("api/v1")
	auth.Use(middleware.JwtToken())
	{
		/* 用户模块的路由接口 */
		// 编辑用户信息
		auth.POST("user/update", controller.EditUser)
		// 删除用户
		auth.DELETE("user/:id", controller.DeleteUser)

		/* 分类模块的路由接口 */
		// 添加分类
		auth.POST("category/add", controller.AddCategory)
		// 编辑分类信息
		auth.POST("category/add", controller.EditCategory)
		// 删除分类
		auth.DELETE("category/:id", controller.DeleteCategory)

		/* 文章模块的路由接口 */
		// 添加文章
		auth.POST("article/add", controller.ActiveEmail)
		// 添加评论
		auth.POST("comment", controller.AddComment)
		// 编辑文章
		auth.PUT("article/:id", controller.EditArticle)
		// 删除文章
		auth.DELETE("article/:id", controller.DeleteArticle)
		// 删除评论
		auth.DELETE("comment/:id", controller.DeleteComment)
		// 上传文件
		auth.POST("upload", controller.Upload)
		// 更新个人设置
		auth.PUT("profile", controller.UpdateProfile)
	}

	route := r.Group("api/v1")
	{
		// 添加用户
		route.POST("user/add", controller.AddUser)
		// 查询所有用户
		route.GET("users", controller.GetUser)
		// 查询用户详细信息，包括文章
		route.GET("user/:id", controller.GetUserInfo)
		// 通过id查询分类信息
		route.GET("category/:id", controller.FindCategoryById)
		// 查询所有分类
		route.GET("category", controller.GetCategory)
		// 查询所有文章信息
		route.GET("articles", controller.GetArticle)
		// 查询某篇文章的详细信息
		route.GET("article/cate/:id", controller.GetCateArticle)
		// 查询某文章下的所有评论
		route.GET("comment/:id", controller.GetCommetns)
		// 登陆
		route.POST("login", controller.Login)
		// 注册用户
		route.POST("/register", controller.ActiveEmail)
		// 邮件激活
		route.GET("/active", controller.ActiveEmail)
		// 登陆发送邮件，需要参数email
		route.GET("sendmail", controller.SendEmailForCode)
		// 使用邮箱登陆，需要参数email和验证码
		route.GET("loginbyemail", controller.LoginByEmail)
		// 获取个人信息
		route.GET("profile", controller.GetProfile)
	}

	r.Run(utils.HttpPort)
}
