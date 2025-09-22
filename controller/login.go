package controller

import (
	"encoding/json"
	"fmt"
	"goblog/middleware"
	"goblog/model"
	"goblog/utils"
	"goblog/utils/errmsg"
	"goblog/utils/validator"
	"net/http"

	"github.com/gin-gonic/gin"
)

// 注册
func Register(c *gin.Context) {
	var user model.User
	_ = c.ShouldBindJSON(&user)
	// 对传过来的数据进行校验
	msg, code := validator.Validate(&user)
	// 校验失败，返回错误信息
	if code != errmsg.SUCCESS {
		c.JSON(http.StatusOK, gin.H{
			"code":    code,
			"message": msg,
		})
		return
	}
	// 判断用户是否存在
	code = model.CheckUser(user.Username)
	if code == errmsg.SUCCESS {
		// 用户不存在，可以注册
		// 设置激活码，唯一字符串
		user.Code = utils.CreateUUID()
		// 设置激活状态
		user.Status = "N"

		// 发送邮件
		content := "<a href = 'http://localhost" + utils.HttpPort + "/api/v1/active?code=" + user.Code + "'>Click me to activate your account</a>"
		model.SendEmail(user.Email, "Activation Email", content)

		// 将注册的用户保存到数据库
		_, code = model.CreateUser(&user)
	}
	c.JSON(http.StatusOK, gin.H{
		"code":    code,
		"message": errmsg.GetErrMsg(code),
	})
}

// 邮件激活
func ActiveEmail(c *gin.Context) {
	var code int
	vCode := c.Query("code")
	if len(vCode) == 0 {
		code = errmsg.ERROR_EMAIL_CODE_NOT_EXIST
		c.JSON(http.StatusOK, gin.H{
			"code":     code,
			"messsage": errmsg.GetErrMsg(code),
		})
		return
	}
	code = model.UpdateUserStatus(vCode)

	c.JSON(http.StatusOK, gin.H{
		"code":    code,
		"message": errmsg.GetErrMsg(code),
	})
}

// 登陆
func Login(c *gin.Context) {
	var data model.User
	_ = c.ShouldBindJSON(&data)
	var token string
	var code int
	user, code := model.CheckLogin(data.Username, data.Password)

	if code == errmsg.SUCCESS {
		token, code = middleware.SetToken(data.Username)
		model.ClearSession(c)
		model.SetSession(c, token, int(utils.Expiration))
		profile, codeGetProfile := model.GetProfileById(int(user.ID))
		profileJson, _ := json.Marshal(profile)
		if codeGetProfile == errmsg.SUCCESS {
			_, err := model.Redis.Set(token, string(profileJson), utils.Expiration).Result()
			if err != nil {
				fmt.Println("redis set fail", err)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    code,
		"message": errmsg.GetErrMsg(code),
		"token":   token,
	})
}

// 发送邮件
func SendEmailForCode(c *gin.Context) {
	to := c.Query("email")
	code := utils.CreateVcode()
	content := "<h2>欢迎使用博客，您的验证码是</h2><h3 style='color:blue'>" + code + "</h3>"
	// 将验证码存储到redis中
	model.Redis.Do("set", to, code)
	status := model.SendEmail(to, "验证码", content)
	c.JSON(http.StatusOK, gin.H{
		"status":  status,
		"message": errmsg.GetErrMsg(status),
	})
}

// 用邮件登陆
func LoginByEmail(c *gin.Context) {
	var token string
	var code int
	var user model.User
	to := c.Query("email")
	userCode := c.Query("code")
	// 从redis中拿到正确的验证码做比较
	serverCode := model.Redis.Get(to).Val()

	// 比较验证码
	if userCode != serverCode {
		code = errmsg.ERROR_CODE_WRONG
		c.JSON(http.StatusOK, gin.H{
			"code":    code,
			"message": errmsg.GetErrMsg(code),
		})
		return
	}
	// 通过email查找用户
	user, code = model.GetUserByEmail(to)
	if code == errmsg.SUCCESS {
		// jwt验证
		token, code = middleware.SetToken(user.Username)
	}
	// 登陆成功后删除redis中的email，防止重复使用
	model.Redis.Del(to)
	c.JSON(http.StatusOK, gin.H{
		"code":    code,
		"message": errmsg.GetErrMsg(code),
		"token":   token,
	})
}
