package validator

import (
	"fmt"
	"goblog/utils/errmsg"
	"reflect"

	"github.com/go-playground/locales/zh"              // 1. 使用新的中文包
	ut "github.com/go-playground/universal-translator" // 2. 引入通用翻译器
	"github.com/go-playground/validator/v10"
	zh_translations "github.com/go-playground/validator/v10/translations/zh" // 3. 引入针对 validator 的中文翻译器
)

// Validate 函数用于验证后端数据
func Validate(data any) (string, int) {
	// 创建一个新的验证器实例
	validate := validator.New()

	// --- 以下是翻译器初始化的新方法 ---

	// 创建一个中文地域实例
	chinese := zh.New()
	// 创建一个通用翻译器，并将中文设置为默认和备用语言
	uni := ut.New(chinese, chinese)

	// 从通用翻译器中获取指定的翻译器实例 ("zh")
	trans, found := uni.GetTranslator("zh")
	if !found {
		// 在这种情况下，翻译器理应能找到。如果找不到，可以记录一个错误日志。
		fmt.Println("translator not found")
	}

	// 向验证器注册获取到的中文翻译器
	err := zh_translations.RegisterDefaultTranslations(validate, trans)
	if err != nil {
		fmt.Println("err:  ", err)
	}

	// 注册一个函数，用于在错误消息中显示字段的 "label" 标签。
	// 如果 "label" 标签不存在，则默认使用字段本身的名称。
	validate.RegisterTagNameFunc(func(field reflect.StructField) string {
		label := field.Tag.Get("label")
		if label == "" {
			return field.Name
		}
		return label
	})

	// 对传入的数据结构进行验证
	err = validate.Struct(data)
	if err != nil {
		// 如果验证失败，错误会是一个切片。我们遍历它，翻译并返回第一个错误信息。
		for _, v := range err.(validator.ValidationErrors) {
			return v.Translate(trans), errmsg.ERROR
		}
	}

	// 如果验证通过，返回成功状态
	return "", errmsg.SUCCESS
}
