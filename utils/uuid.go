package utils

import (
	"math/rand"
	"strings"
	"time"

	"github.com/google/uuid"
)

const codeHub = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"
const codeLength = 4

// 生成激活码
func CreateUUID() string {
	// New creates a new random UUID or panics.
	id := uuid.New()
	return id.String()
}

// 生成四位数验证码
func CreateVcode() string {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	var code strings.Builder
	code.Grow(codeLength)

	for range codeLength {
		index := r.Intn(len(codeHub))
		code.WriteByte(codeHub[index])
	}

	return code.String()
}
