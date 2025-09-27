package model

import (
	"goblog/utils"
	"goblog/utils/errmsg"
	"strconv"

	"github.com/go-gomail/gomail"
)

// SendEmail now returns a standard error.
func SendEmail(to string, title string, body string) error {
	m := gomail.NewMessage()

	m.SetHeader("From", utils.FromEmail)
	m.SetHeader("To", to)
	m.SetHeader("Subject", title)
	m.SetBody("text/html", body)

	serverPort, _ := strconv.Atoi(utils.ServerPort)
	d := gomail.NewDialer(utils.ServerHost, serverPort, utils.FromEmail, utils.FromPassword)

	if err := d.DialAndSend(m); err != nil {
		// If sending fails, return a predefined application error.
		return errmsg.ErrEmailSendFailed.WithMsg("Failed to send email to %s: %v", to, err)
	}

	return nil // Success
}

// // Mailer 是邮件拨号器的接口
// type Mailer interface {
// 	DialAndSend(...*gomail.Message) error
// }

// func TestSendEmail(d Mailer, to string, title string, text string) int {
// 	m := gomail.NewMessage()

// 	m.SetHeader("From", utils.FromEmail)
// 	m.SetHeader("To", to)
// 	m.SetHeader("Subject", title)
// 	m.SetBody("text/html", text)

// 	if err := d.DialAndSend(m); err != nil {
// 		fmt.Println("发送邮件时出错:", err)
// 		return errmsg.ERROR_EMAIL_SEND
// 	}
// 	fmt.Println("邮件发送成功 (模拟)")
// 	return errmsg.SUCCESS
// }
