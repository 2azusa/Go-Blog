package middleware

import (
	"errors"
	"goblog/model"
	"goblog/utils"
	"goblog/utils/errmsg"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

// JwtKey 从配置文件或环境变量中读取，这是一个更安全的实践
var JwtKey = []byte(utils.JwtKey)

// MyClaims 是自定义的 JWT 声明，包含了用户名
type MyClaims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// SetToken 生成 JWT Token
// 重构后的函数返回 (string, *errmsg.AppError)，在成功时 error 为 nil
func SetToken(username string) (string, *errmsg.AppError) {
	expireTime := time.Now().Add(24 * time.Hour) // Token 有效期设为 24 小时
	claims := MyClaims{
		username,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expireTime),
			Issuer:    "go-blog", // 签发人
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(JwtKey)
	if err != nil {
		// 如果签名失败，返回一个内部服务器错误
		return "", errmsg.ErrInternalServer.WithMsg("Token 签名失败: %v", err)
	}

	return tokenString, nil
}

// CheckToken 验证 JWT Token 的有效性
// 重构后的函数返回 (*MyClaims, *errmsg.AppError)，在成功时 error 为 nil
func CheckToken(tokenString string) (*MyClaims, *errmsg.AppError) {
	token, err := jwt.ParseWithClaims(tokenString, &MyClaims{}, func(token *jwt.Token) (interface{}, error) {
		return JwtKey, nil
	})

	if err != nil {
		var ve *jwt.ValidationError
		if errors.As(err, &ve) {
			if ve.Errors&jwt.ValidationErrorMalformed != 0 {
				return nil, errmsg.ErrTokenWrong // Token 格式不正确
			} else if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
				return nil, errmsg.ErrTokenExpired // Token 已过期或未生效
			}
		}
		return nil, errmsg.ErrTokenWrong // 其他 Token 错误
	}

	if claims, ok := token.Claims.(*MyClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errmsg.ErrTokenWrong
}

// JwtToken 是一个 Gin 中间件，用于保护需要认证的路由
func JwtToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. 从请求头中获取 "Authorization" 字段
		tokenHeader := c.Request.Header.Get("Authorization")
		if tokenHeader == "" {
			appErr := errmsg.ErrTokenNotExist
			c.JSON(appErr.HTTPStatus, appErr)
			c.Abort()
			return
		}

		// 2. 校验 "Authorization" 头的格式，应为 "Bearer <token>"
		checkToken := strings.SplitN(tokenHeader, " ", 2)
		if len(checkToken) != 2 || checkToken[0] != "Bearer" {
			appErr := errmsg.ErrTokenTypeWrong
			c.JSON(appErr.HTTPStatus, appErr)
			c.Abort()
			return
		}

		// 3. 调用 CheckToken 函数验证令牌
		claims, appErr := CheckToken(checkToken[1])
		if appErr != nil {
			c.JSON(appErr.HTTPStatus, appErr)
			c.Abort()
			return
		}

		// 4. (推荐) 验证通过后，获取用户信息并存入上下文，方便后续使用
		// 这样，后续的控制器就可以直接获取 user ID，而不是每次都查数据库
		user, err := model.FindUserByName(claims.Username)
		if err != nil {
			// 如果在 token 有效期内，用户被删除了，就会发生这种情况
			appErr := errmsg.ErrUserNotExist
			c.JSON(appErr.HTTPStatus, appErr)
			c.Abort()
			return
		}

		// 将用户信息存入 Gin 的上下文，供后续的处理函数使用
		c.Set("username", user.Username)
		c.Set("userID", user.ID) // 存储用户ID，非常有用！

		// 继续处理请求
		c.Next()
	}
}
