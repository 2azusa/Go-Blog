package router

import (
	"goblog/controller"
	"goblog/middleware"
	"goblog/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitRouter() {
	gin.SetMode(utils.AppMode)

	apiRouter := gin.New()
	apiRouter.Use(gin.Recovery(), middleware.Logger(), middleware.Cors())
	apiGroup := apiRouter.Group("api/v1")
	registerApiRoutes(apiGroup)

	frontRouter := gin.New()
	frontRouter.Static("/assets", "./static/front/dist/assets")
	frontRouter.StaticFile("/favicon.ico", "./static/front/dist/favicon.ico")
	frontRouter.NoRoute(func(c *gin.Context) {
		c.File("./static/front/dist/index.html")
	})

	adminRouter := gin.New()
	adminRouter.Static("/assets", "./static/admin/dist/assets")
	adminRouter.StaticFile("/favicon.ico", "./static/admin/dist/favicon.ico")
	adminRouter.NoRoute(func(c *gin.Context) {
		c.File("./static/admin/dist/index.html")
	})

	go func() {
		log.Printf("Frontend server running on http://localhost%s", utils.AdminPort)
		if err := http.ListenAndServe(utils.FrontPort, frontRouter); err != nil {
			log.Fatalf("Failed to run frontend server: %v", err)
		}
	}()

	go func() {
		log.Printf("Admin server running on http://localhost%s", utils.AdminPort)
		if err := http.ListenAndServe(utils.AdminPort, adminRouter); err != nil {
			log.Fatalf("Failed to run admin server: %v", err)
		}
	}()

	log.Printf("API server running on http://localhost%s", utils.HttpPort)
	if err := http.ListenAndServe(utils.HttpPort, apiRouter); err != nil {
		log.Fatalf("Failed to run API server: %v", err)
	}
}

func registerApiRoutes(apiV1 *gin.RouterGroup) {
	{
		// 用户/认证模块
		apiV1.POST("register", controller.Register)           // 用户注册 | 参数来源: JSON 请求体
		apiV1.POST("login", controller.Login)                 // 用户名密码登录 | 参数来源: JSON 请求体
		apiV1.POST("login/email", controller.LoginByEmail)    // 邮箱验证码登录 | 参数来源: JSON 请求体
		apiV1.POST("email/code", controller.SendEmailForCode) // 发送邮箱验证码 | 参数来源: JSON 请求体
		apiV1.GET("active", controller.ActiveEmail)           // 邮箱激活链接 | 参数来源: URL 查询参数 (e.g., /active?code=xxx)

		// 分类模块
		apiV1.GET("categories", controller.GetCategory)                 // 获取所有分类列表 | 参数来源: URL 查询参数 (e.g., /categories?pagesize=10)
		apiV1.GET("categories/:id", controller.FindCategoryById)        // 获取单个分类信息 | 参数来源: URL 路径参数 (e.g., /categories/123)
		apiV1.GET("categories/:id/articles", controller.GetCateArticle) // 获取某分类下的所有文章 | 参数来源: URL 路径参数 (+ 可选查询参数分页)

		// 文章模块
		apiV1.GET("articles", controller.GetArticle)         // 获取文章列表 | 参数来源: URL 查询参数
		apiV1.GET("articles/:id", controller.GetArticleInfo) // 获取单篇文章详情 | 参数来源: URL 路径参数

		// 评论模块
		apiV1.GET("articles/:id/comments", controller.GetCommentsByArticleId) // 获取某文章下的所有评论 | 参数来源: URL 路径参数
	}

	// --- 权限接口 (需要 JWT Token 验证) ---
	apiV1.Use(middleware.JwtToken())
	{
		// 用户/个人模块
		apiV1.GET("users", controller.GetUser)           // 获取用户列表 | 参数来源: URL 查询参数
		apiV1.POST("users/add", controller.AddUser)      // 添加用户 | 参数来源: JSON 请求体
		apiV1.GET("users/:id", controller.GetUserInfo)   // 获取指定用户详情 | 参数来源: URL 路径参数
		apiV1.PUT("users/:id", controller.EditUser)      // 编辑指定用户信息 | 参数来源: URL 路径参数 + JSON 请求体
		apiV1.DELETE("users/:id", controller.DeleteUser) // 删除指定用户 | 参数来源: URL 路径参数

		apiV1.GET("profile", controller.GetProfile)    // 获取当前登录用户的个人信息 | 参数来源: JWT Token
		apiV1.PUT("profile", controller.UpdateProfile) // 更新当前登录用户的个人信息 | 参数来源: JSON 请求体

		// 分类模块
		apiV1.POST("categories", controller.AddCategory)          // 新增分类 | 参数来源: JSON 请求体
		apiV1.PUT("categories/:id", controller.EditCategory)      // 编辑分类 | 参数来源: URL 路径参数 + JSON 请求体
		apiV1.DELETE("categories/:id", controller.DeleteCategory) // 删除分类 | 参数来源: URL 路径参数

		// 文章模块
		apiV1.POST("articles", controller.AddArticle)          // 新增文章 | 参数来源: JSON 请求体
		apiV1.PUT("articles/:id", controller.EditArticle)      // 编辑文章 | 参数来源: URL 路径参数 + JSON 请求体
		apiV1.DELETE("articles/:id", controller.DeleteArticle) // 删除文章 | 参数来源: URL 路径参数

		// 评论模块
		apiV1.POST("comments", controller.AddComment)          // 发表评论 | 参数来源: JSON 请求体
		apiV1.DELETE("comments/:id", controller.DeleteComment) // 删除评论 | 参数来源: URL 路径参数

		// 文件上传
		apiV1.POST("upload", controller.Upload) // 上传文件 | 参数来源: 表单 (multipart/form-data)
	}
}

// func InitRouter() {
// 	gin.SetMode(utils.AppMode)
// 	r := gin.New()
// 	r.Use(gin.Recovery())
// 	r.Use(middleware.Logger())
// 	r.Use(middleware.Cors())

// 	// 后台管理的页面加载
// 	r.Static("/assets", "./static/admin/dist/assets")
// 	r.NoRoute(func(c *gin.Context) {
// 		c.File("./static/admin/dist/index.html")
// 	})

// 	// 前台展示的的页面加载
// 	r.Static("/assets", "./static/front/dist/assets")
// 	r.NoRoute(func(c *gin.Context) {
// 		c.File("./static/front/dist/index.html")
// 	})

// 	// --- API 路由 ---
// 	// apiV1 := r.Group("api/v1")

// 	// --- 公共接口 (无需 Token 验证) ---

// 	r.Run(utils.HttpPort)
// }
