package middleware

import (
	"goblog/utils"
	"goblog/utils/errmsg"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

var JwtKey = []byte(utils.JwtKey)

type MyClaims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// 生成token
func SetToken(username string) (string, int) {
	// 设置过期时间
	expireTime := time.Now().Add(24 * time.Hour) // 24小时
	// 创建Jwt声明
	claims := MyClaims{
		username,
		// 初始化 jwt.RegisteredClaims
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expireTime),
			Issuer:    "go-blog",
		},
	}

	// 创建Token对象
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// 使用预设的JwtKey对Token进行签名，生成最终的令牌字符串
	tokenString, err := token.SignedString(JwtKey)
	// 如果出错，则返回服务器内部错误
	if err != nil {
		return "", errmsg.ERROR
	}
	return tokenString, errmsg.SUCCESS
}

// 验证token
func CheckToken(tokenString string) (*MyClaims, int) {
	token, err := jwt.ParseWithClaims(tokenString, &MyClaims{}, func(token *jwt.Token) (any, error) {
		return JwtKey, nil
	})

	if err != nil {
		// 判断错误类型
		if ve, ok := err.(*jwt.ValidationError); ok {
			if ve.Errors&jwt.ValidationErrorMalformed != 0 {
				return nil, errmsg.ERROR_TOKEN_WRONG // token格式错误
			} else if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
				return nil, errmsg.ERROR_TOKEN_RUNTIEM // token过期
			} else {
				return nil, errmsg.ERROR_TOKEN_WRONG // token无效
			}
		}
		return nil, errmsg.ERROR_TOKEN_WRONG // token无效
	}

	if claims, ok := token.Claims.(*MyClaims); ok && token.Valid {
		return claims, errmsg.SUCCESS
	}
	return nil, errmsg.ERROR_TOKEN_WRONG
}

// Jwt中间件
func JwtToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		var code int

		// 从请求头中获取 "Authorization" 字段
		tokenHeader := c.Request.Header.Get("Authorization")
		if tokenHeader == "" {
			code = errmsg.ERROR_TOKEN_NOT_EXIST // 1004
			c.JSON(http.StatusOK, gin.H{
				"status":  code,
				"message": errmsg.GetErrMsg(code),
			})
			c.Abort()
			return
		}

		// 按空格分割Authorization头，格式应为 "Bearer <token>"
		checkToken := strings.SplitN(tokenHeader, " ", 2)
		if len(checkToken) != 2 || checkToken[0] != "Bearer" {
			code = errmsg.ERROR_TOKEN_TYPE_WRONG
			c.JSON(http.StatusOK, gin.H{
				"status":  code,
				"message": errmsg.GetErrMsg(code),
			})
			c.Abort()
			return
		}

		// 调用CheckToken函数验证令牌的有效性
		claims, tCode := CheckToken(checkToken[1])
		if tCode != errmsg.SUCCESS {
			c.JSON(http.StatusOK, gin.H{
				"status":  tCode,
				"message": errmsg.GetErrMsg(tCode),
			})
			c.Abort()
			return
		}

		c.Set("username", claims.Username)
		c.Next()
	}
}
