package validator

import (
	"fmt"
	"goblog/utils/errmsg"
	"reflect"
	"sync"

	"github.com/go-playground/locales/zh"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	zh_translations "github.com/go-playground/validator/v10/translations/zh"
)

// 定义全局的验证器和翻译器实例
var (
	validate *validator.Validate
	trans    ut.Translator
	once     sync.Once // 使用 sync.Once 确保初始化操作只执行一次
)

// initValidator 是一个私有函数，用于初始化全局的验证器和翻译器
func initValidator() {
	// 1. 创建一个新的验证器实例
	validate = validator.New()

	// 2. 初始化翻译器
	chinese := zh.New()
	uni := ut.New(chinese, chinese)

	var found bool
	trans, found = uni.GetTranslator("zh")
	if !found {
		// 这是一个严重问题，程序应该在启动时就失败
		panic("translator not found")
	}

	// 3. 注册中文翻译器到验证器
	err := zh_translations.RegisterDefaultTranslations(validate, trans)
	if err != nil {
		panic(fmt.Sprintf("failed to register translations: %v", err))
	}

	// 4. 注册一个自定义的标签名函数
	// 这使得错误消息可以使用 struct 字段的 "label" 或 "json" 标签，而不是字段名
	validate.RegisterTagNameFunc(func(field reflect.StructField) string {
		// 优先使用 'label' 标签
		label := field.Tag.Get("label")
		if label != "" {
			return label
		}
		// 其次使用 'json' 标签
		jsonTag := field.Tag.Get("json")
		if jsonTag != "" {
			return jsonTag
		}
		// 最后使用字段名
		return field.Name
	})
}

// Validate 函数用于验证数据结构
func Validate(data interface{}) error {
	// 使用 sync.Once 来确保全局实例只被初始化一次，这是线程安全的
	once.Do(initValidator)

	// 对传入的数据进行验证
	err := validate.Struct(data)
	if err != nil {
		// 将 validator 的错误转换成一个单一的、可读的字符串
		var errMsgs []string
		for _, v := range err.(validator.ValidationErrors) {
			errMsgs = append(errMsgs, v.Translate(trans))
		}

		// 通常，返回第一条错误就足够了
		errMsg := errMsgs[0]

		// --- 这里是修正的部分 ---
		// 返回一个预定义的“参数无效”错误，并将具体的验证失败信息作为参数附加到消息中
		// 第一个参数是常量格式化字符串 "%s"，第二个参数是变量 errMsg
		return errmsg.ErrInvalidParams.WithMsg("参数错误: %s", errMsg)
	}

	// 如果验证通过，返回 nil
	return nil
}
