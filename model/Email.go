package model

import (
	"fmt"
	"goblog/utils"
	"goblog/utils/errmsg"
	"strconv"

	"github.com/go-gomail/gomail"
)

func SendEmail(to string, title string, text string) int {
	m := gomail.NewMessage()

	m.SetHeader("From", utils.FromEmail)
	m.SetHeader("To", to)
	m.SetHeader("Subject", title)
	m.SetBody("text/html", text)
	serverPort, _ := strconv.Atoi(utils.ServerPort)
	d := gomail.NewDialer(utils.ServerHost, serverPort, "test@163.com", utils.FromPassword)

	if err := d.DialAndSend(m); err != nil {
		return errmsg.ERROR_EMAIL_SEND
	}
	fmt.Println("Email sent")
	return errmsg.SUCCESS
}
