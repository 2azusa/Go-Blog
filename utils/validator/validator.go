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

var (
	validate *validator.Validate
	trans    ut.Translator
	once     sync.Once
)

// initValidator 初始化验证器和其中文翻译器。
// 此函数通过 sync.Once 保证在程序生命周期内只执行一次。
func initValidator() {
	validate = validator.New()
	chinese := zh.New()
	uni := ut.New(chinese, chinese)

	var found bool
	trans, found = uni.GetTranslator("zh")
	if !found {
		// 翻译器是必要组件，如果找不到，程序无法正常工作
		panic("fatal error: translator 'zh' not found")
	}

	if err := zh_translations.RegisterDefaultTranslations(validate, trans); err != nil {
		panic(fmt.Sprintf("fatal error: failed to register translations: %v", err))
	}

	// 注册一个自定义的标签名函数，使得错误消息更加友好。
	// 它会按顺序尝试使用 struct 字段的 "label" 或 "json" 标签作为字段名，
	// 如果都找不到，则回退到原始的字段名。
	validate.RegisterTagNameFunc(func(field reflect.StructField) string {
		if label := field.Tag.Get("label"); label != "" {
			return label
		}
		if jsonTag := field.Tag.Get("json"); jsonTag != "" {
			return jsonTag
		}
		return field.Name
	})
}

// Validate 对传入的数据结构执行验证。
// 它封装了 go-playground/validator 的核心功能，并提供了统一的中文错误信息处理。
func Validate(data any) error {
	once.Do(initValidator)

	err := validate.Struct(data)
	if err != nil {
		// 将所有验证错误翻译成中文消息
		var errMsgs []string
		// 使用类型断言来访问具体的验证错误
		validationErrs, ok := err.(validator.ValidationErrors)
		if !ok {
			// 如果不是预期的验证错误类型，则直接返回原始错误
			return errmsg.ErrInvalidParams.WithMsg("参数错误: %v", err)
		}

		for _, v := range validationErrs {
			errMsgs = append(errMsgs, v.Translate(trans))
		}

		// 为保持接口简洁，通常只返回第一条错误信息给前端
		errMsg := errMsgs[0]

		// 返回一个预定义的“参数无效”错误，并将具体的验证失败信息作为参数附加
		return errmsg.ErrInvalidParams.WithMsg("参数错误: %s", errMsg)
	}

	return nil
}
