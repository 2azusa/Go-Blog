package controller

import (
	"goblog/dto"
	"goblog/middleware"
	"goblog/model"
	"goblog/utils/errmsg"
	"goblog/utils/validator"
	"net/http"

	"github.com/gin-gonic/gin"
)

const SessionExpireTime = 3600 * 24

// Register 处理用户注册
// @Router /api/v1/register [post]
func Register(c *gin.Context) {
	var req dto.ReqRegister
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	if err := validator.Validate(&req); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	newUser := &model.User{
		Username: req.Username,
		Password: req.Password,
		Email:    req.Email,
		Role:     2,
	}

	if err := model.RegisterUser(newUser); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.RegisterSuccess.Status,
		"message": errmsg.RegisterSuccess.Message,
	})
}

// ActiveEmail 处理从邮件链接过来的账户激活请求
// @Router /api/v1/active [get]
func ActiveEmail(c *gin.Context) {
	var req dto.ReqActiveEmail
	if err := c.ShouldBindQuery(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	if err := model.ActivateUserByCode(req.Code); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.ActivateSuccess.Status,
		"message": errmsg.ActivateSuccess.Message,
	})
}

// Login 处理用户名密码登录，同时支持 Session 和 JWTks
// @Router /api/v1/login [post]
func Login(c *gin.Context) {
	var req dto.ReqLogin
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	// 错误类型 1: 数据格式错误 (由 validator 检查)
	if err := validator.Validate(&req); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	// 1. 验证用户名和密码
	// 错误类型 2: 业务逻辑/数据库错误 (validator 完全无能为力)
	user, err := model.CheckLogin(req.Username, req.Password)
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	// --- 凭证颁发开始 ---

	// 2. 为 Web 浏览器创建 Session 并设置 Cookie
	// 错误类型 3: 内部系统错误 (validator 同样无能为力)
	sessionID, err := model.CreateSession(user.ID)
	if err != nil {
		// 在生产环境中，这里应该记录严重错误日志
		appErr := errmsg.FromError(errmsg.ErrCreateSessionError)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}
	model.SetSessionCookie(c, sessionID)

	// 3. 为移动 App / API 客户端生成 JWT
	token, appErr := middleware.SetToken(user.Username)
	if appErr != nil {
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	// --- 凭证颁发结束 ---

	// 4. 返回包含两种凭证信息的响应
	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.SUCCESS.Status,
		"token":   token,
		"message": errmsg.SUCCESS.Message,
	})
}

// SendEmailForCode 发送用于邮箱登录的验证码
// @Router /api/v1/email/code [post]
func SendEmailForCode(c *gin.Context) {
	var req dto.ReqSendEmailForCode
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	if err := validator.Validate(&req); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	if err := model.SendVerificationCode(req.Email); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.SendCodeSuccess.Status,
		"message": errmsg.SendCodeSuccess.Message,
	})
}

// LoginByEmail 处理邮箱和验证码登录
// @Router /api/v1/login/email [post]
func LoginByEmail(c *gin.Context) {
	var req dto.ReqLoginByEmail
	if err := c.ShouldBindJSON(&req); err != nil {
		appErr := errmsg.BindError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	if err := validator.Validate(&req); err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	user, err := model.CheckLoginByEmail(req.Email, req.Code)
	if err != nil {
		appErr := errmsg.FromError(err)
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	token, appErr := middleware.SetToken(user.Username)
	if appErr != nil {
		c.JSON(appErr.HTTPStatus, appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  errmsg.SUCCESS.Status,
		"token":   token,
		"message": errmsg.SUCCESS.Message,
	})
}
