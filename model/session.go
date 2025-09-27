package model

import (
	"context" // 1. 确保引入 context
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// 定义一个全局的 context，以便在所有 redis 操作中使用
var ctx = context.Background()

const (
	SessionName       = "session_id"
	SessionExpireTime = time.Second * 3600 * 24 * 7 // Session 在 Redis 中的过期时间 (7天)
)

// CreateSession 为指定用户ID创建一个新的会话。
func CreateSession(userID uint) (string, error) {
	sessionID := uuid.NewString()
	key := fmt.Sprintf("session:%s", sessionID)

	// 2. 使用带有 context 的 Set 方法
	err := Redis.Set(ctx, key, userID, SessionExpireTime).Err()
	if err != nil {
		return "", err
	}

	return sessionID, nil
}

// DeleteSession 从 Redis 中删除一个会话记录
func DeleteSession(sessionID string) error {
	key := fmt.Sprintf("session:%s", sessionID)
	// 3. 使用带有 context 的 Del 方法
	return Redis.Del(ctx, key).Err()
}

// GetUserIDBySession 从 Redis 中通过 sessionID 查找用户ID
func GetUserIDBySession(sessionID string) (uint, error) {
	key := fmt.Sprintf("session:%s", sessionID)
	// 4. 使用带有 context 的 Get 方法
	val, err := Redis.Get(ctx, key).Uint64()
	if err != nil {
		return 0, err
	}
	return uint(val), nil
}

// SetSessionCookie 将 sessionID 写入客户端的 Cookie
func SetSessionCookie(c *gin.Context, sessionID string) {
	// 将 time.Duration 转换为 int 秒数
	c.SetCookie(SessionName, sessionID, int(SessionExpireTime.Seconds()), "/", "localhost", false, true)
}

// ClearSessionCookie 清除客户端的 session cookie
func ClearSessionCookie(c *gin.Context) {
	c.SetCookie(SessionName, "", -1, "/", "localhost", false, true)
}
