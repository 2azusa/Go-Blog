package model

import (
	"context"
	"fmt"
	"goblog/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

var ctx = context.Background()

const (
	SessionName       = "session_id"
	SessionExpireTime = utils.Expiration
)

// CreateSession 为指定用户ID创建一个新的会话。
func CreateSession(userID uint) (string, error) {
	sessionID := uuid.NewString()
	key := fmt.Sprintf("session:%s", sessionID)

	err := Redis.Set(ctx, key, userID, SessionExpireTime).Err()
	if err != nil {
		return "", err
	}

	return sessionID, nil
}

// DeleteSession 从 Redis 中删除一个会话记录
func DeleteSession(sessionID string) error {
	key := fmt.Sprintf("session:%s", sessionID)
	return Redis.Del(ctx, key).Err()
}

// GetUserIDBySession 从 Redis 中通过 sessionID 查找用户ID
func GetUserIDBySession(sessionID string) (uint, error) {
	key := fmt.Sprintf("session:%s", sessionID)
	val, err := Redis.Get(ctx, key).Uint64()
	if err != nil {
		return 0, err
	}
	return uint(val), nil
}

// SetSessionCookie 将 sessionID 写入客户端的 Cookie
func SetSessionCookie(c *gin.Context, sessionID string) {
	c.SetCookie(SessionName, sessionID, int(SessionExpireTime.Seconds()), "/", "localhost", false, true)
}

// ClearSessionCookie 清除客户端的 session cookie
func ClearSessionCookie(c *gin.Context) {
	c.SetCookie(SessionName, "", -1, "/", "localhost", false, true)
}
