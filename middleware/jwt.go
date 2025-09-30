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

var JwtKey = []byte(utils.JwtKey)

type MyClaims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// SetToken generates a JWT Token.
func SetToken(username string) (string, *errmsg.AppError) {
	expireTime := time.Now().Add(24 * time.Hour)
	claims := MyClaims{
		username,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expireTime),
			Issuer:    "go-blog",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(JwtKey)
	if err != nil {
		return "", errmsg.ErrInternalServer.WithMsg("Failed to sign token: %v", err)
	}

	return tokenString, nil
}

// CheckToken validates the JWT Token.
func CheckToken(tokenString string) (*MyClaims, *errmsg.AppError) {
	token, err := jwt.ParseWithClaims(tokenString, &MyClaims{}, func(token *jwt.Token) (interface{}, error) {
		return JwtKey, nil
	})

	if err != nil {
		var ve *jwt.ValidationError
		if errors.As(err, &ve) {
			if ve.Errors&jwt.ValidationErrorMalformed != 0 {
				return nil, errmsg.ErrTokenWrong
			} else if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
				return nil, errmsg.ErrTokenExpired
			}
		}
		return nil, errmsg.ErrTokenWrong
	}

	if claims, ok := token.Claims.(*MyClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errmsg.ErrTokenWrong
}

// JwtToken is a Gin middleware for protecting authenticated routes.
func JwtToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenHeader := c.Request.Header.Get("Authorization")
		if tokenHeader == "" {
			appErr := errmsg.ErrTokenNotExist
			c.JSON(appErr.HTTPStatus, appErr)
			c.Abort()
			return
		}

		checkToken := strings.SplitN(tokenHeader, " ", 2)
		if len(checkToken) != 2 || checkToken[0] != "Bearer" {
			appErr := errmsg.ErrTokenTypeWrong
			c.JSON(appErr.HTTPStatus, appErr)
			c.Abort()
			return
		}

		claims, appErr := CheckToken(checkToken[1])
		if appErr != nil {
			c.JSON(appErr.HTTPStatus, appErr)
			c.Abort()
			return
		}

		user, err := model.FindUserByName(claims.Username)
		if err != nil {
			appErr := errmsg.ErrUserNotExist
			c.JSON(appErr.HTTPStatus, appErr)
			c.Abort()
			return
		}

		c.Set("username", user.Username)
		c.Set("userID", user.ID)

		c.Next()
	}
}
