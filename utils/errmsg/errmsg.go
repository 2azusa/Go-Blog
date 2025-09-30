package errmsg

import (
	"fmt"
	"net/http"
)

// AppError 是我们自定义的错误/响应类型，包含了业务状态码、信息和HTTP状态码
type AppError struct {
	Status     int    `json:"status"`  // 业务自定义状态码 (原 Code 字段)
	Message    string `json:"message"` // 描述信息
	HTTPStatus int    `json:"-"`       // HTTP状态码 (在JSON响应中忽略)
}

// Error 实现 Go 的 error 接口
func (e *AppError) Error() string {
	return e.Message
}

// NewAppError 创建一个新的 AppError 实例
func NewAppError(httpStatus, status int, message string) *AppError {
	return &AppError{
		Status:     status,
		Message:    message,
		HTTPStatus: httpStatus,
	}
}

// WithMsg 允许为错误附加动态信息 (例如，参数验证失败的具体原因)
func (e *AppError) WithMsg(format string, args ...any) *AppError {
	return &AppError{
		Status:     e.Status,
		Message:    fmt.Sprintf(format, args...),
		HTTPStatus: e.HTTPStatus,
	}
}

// BindError 是一个帮助函数，专门用于处理 gin 的参数绑定错误
// 它封装了统一的错误提示格式
func BindError(err error) *AppError {
	return ErrInvalidParams.WithMsg("请求参数绑定错误: %v", err)
}

// FromError 将一个标准的 error 转换为 *AppError
// 如果转换失败，则返回一个默认的内部服务器错误
func FromError(err error) *AppError {
	if err == nil {
		return nil
	}
	if e, ok := err.(*AppError); ok {
		return e
	}
	return ErrInternalServer.WithMsg("Internal Server Error: %s", err.Error())
}

// --- 预定义的成功响应 ---
var (
	// 通用成功
	SUCCESS = NewAppError(http.StatusOK, 200, "OK")

	// 用户/认证模块
	RegisterSuccess      = NewAppError(http.StatusOK, 200, "注册成功！请检查您的邮箱以激活账户。")
	ActivateSuccess      = NewAppError(http.StatusOK, 200, "账户激活成功！您现在可以登录了。")
	SendCodeSuccess      = NewAppError(http.StatusOK, 200, "验证码发送成功。")
	AddUserSuccess       = NewAppError(http.StatusOK, 200, "用户添加成功")
	UpdateUserSuccess    = NewAppError(http.StatusOK, 200, "用户信息更新成功")
	DeleteUserSuccess    = NewAppError(http.StatusOK, 200, "删除用户成功")
	UpdateProfileSuccess = NewAppError(http.StatusOK, 200, "个人信息更新成功")

	// 文章模块
	CreateArticleSuccess = NewAppError(http.StatusOK, 200, "文章创建成功")
	UpdateArticleSuccess = NewAppError(http.StatusOK, 200, "文章更新成功")
	DeleteArticleSuccess = NewAppError(http.StatusOK, 200, "删除文章成功")

	// 评论模块
	AddCommentSuccess    = NewAppError(http.StatusOK, 200, "评论添加成功")
	DeleteCommentSuccess = NewAppError(http.StatusOK, 200, "删除评论成功")

	// 分类模块
	CreateCategorySuccess = NewAppError(http.StatusOK, 200, "分类创建成功")
	UpdateCategorySuccess = NewAppError(http.StatusOK, 200, "分类更新成功")
	DeleteCategorySuccess = NewAppError(http.StatusOK, 200, "删除分类成功")

	// 上传模块
	UploadSuccess = NewAppError(http.StatusOK, 200, "文件上传成功")
)

// --- 预定义的业务错误 ---
var (
	// 通用错误
	ErrInternalServer = NewAppError(http.StatusInternalServerError, 500, "服务器内部错误")
	ErrInvalidParams  = NewAppError(http.StatusBadRequest, 400, "请求参数无效")

	ErrInvalidArticleID  = NewAppError(http.StatusBadRequest, 400, "无效的文章 ID")
	ErrInvalidCategoryID = NewAppError(http.StatusBadRequest, 400, "无效的分类 ID")
	ErrInvalidCommentID  = NewAppError(http.StatusBadRequest, 400, "无效的评论 ID")
	ErrInvalidUserID     = NewAppError(http.StatusBadRequest, 400, "无效的用户 ID")

	// 用户模块错误 (1000...)
	ErrUsernameUsed       = NewAppError(http.StatusBadRequest, 1001, "用户名已存在！")
	ErrPasswordWrong      = NewAppError(http.StatusUnauthorized, 1002, "密码错误！")
	ErrUserNotExist       = NewAppError(http.StatusNotFound, 1003, "用户不存在！")
	ErrTokenNotExist      = NewAppError(http.StatusUnauthorized, 1004, "TOKEN不存在")
	ErrTokenExpired       = NewAppError(http.StatusUnauthorized, 1005, "TOKEN已过期")
	ErrTokenWrong         = NewAppError(http.StatusUnauthorized, 1006, "TOKEN不正确")
	ErrTokenTypeWrong     = NewAppError(http.StatusUnauthorized, 1007, "TOKEN格式错误")
	ErrNoAdminPermission  = NewAppError(http.StatusForbidden, 1008, "该用户无管理员权限")
	ErrCreateSessionError = NewAppError(http.StatusInternalServerError, 1009, "创建会话失败，请稍后重试")

	// 文章模块错误 (2000...)
	ErrArticleNotExist  = NewAppError(http.StatusNotFound, 2001, "文章不存在!")
	ErrArticleNoComment = NewAppError(http.StatusOK, 2002, "该文章没有评论") // 注意：没有评论通常不是一个错误，返回200 OK

	// 分类模块错误 (3000...)
	ErrCateNameUsed = NewAppError(http.StatusBadRequest, 3001, "该分类已存在！")
	ErrCateNotExist = NewAppError(http.StatusNotFound, 3002, "该分类不存在！")

	// 邮件&激活码模块错误 (4000...)
	ErrEmailCodeNotExist = NewAppError(http.StatusNotFound, 4001, "邮件激活码不存在")
	ErrEmailActiveFailed = NewAppError(http.StatusInternalServerError, 4002, "邮件激活失败")
	ErrEmailNotActive    = NewAppError(http.StatusForbidden, 4003, "邮箱尚未激活")
	ErrEmailSendFailed   = NewAppError(http.StatusInternalServerError, 4004, "邮件发送失败")
	ErrCodeWrong         = NewAppError(http.StatusBadRequest, 4005, "验证码错误")
	ErrEmailUsed         = NewAppError(http.StatusBadRequest, 4006, "邮箱已使用")

	ErrGetFileFailed = NewAppError(http.StatusBadRequest, 400, "无法获取上传文件，请确保请求中包含名为 'file' 的文件字段")
)
