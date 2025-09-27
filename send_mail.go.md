package main

import (
	"fmt"
	"goblog/model"
	"goblog/utils"
	"strconv"

	"github.com/go-gomail/gomail"
)

func main() {

	fmt.Println("正在尝试使用以下配置发送邮件:")
	fmt.Printf("SMTP 服务器: %s:%s\n", utils.ServerHost, utils.ServerPort)
	fmt.Printf("发件人邮箱: %s\n", utils.FromEmail)

	serverPort, err := strconv.Atoi(utils.ServerPort)
	if err != nil {
		fmt.Println("邮件端口配置错误:", err)
		return
	}
	dialer := gomail.NewDialer(utils.ServerHost, serverPort, utils.FromEmail, utils.FromPassword)

	// 3. 定义邮件内容
	to := "tszhotang7@gmail.com"
	subject := "来自 Go-Blog 的手动测试邮件"
	body := "<h1>你好！</h1><p>如果你收到了这封邮件，说明你的 Go 程序邮件发送功能配置成功！</p>"

	fmt.Printf("准备发送邮件给: %s\n", to)

	status := model.SendEmail(dialer, to, subject, body)

	if status == 200 {
		fmt.Println("✅ 邮件发送成功！")
	} else {
		fmt.Printf("❌ 邮件发送失败，错误码: %d\n", status)
	}
}
