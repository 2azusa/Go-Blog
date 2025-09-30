package dto

import "time"

type RspLogin struct {
	User  RspUser `json:"user"`
	Token string  `json:"token"`
}

type RspUser struct {
	ID        uint      `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Role      int       `json:"role"`
}

type RspUpload struct {
	Url string `json:"url"`
}

// type RspProfile struct {
// 	RspUser
// 	Name   string `json:"name"`
// 	Desc   string `json:"desc"`
// 	WeChat string `json:"wechat"`
// 	Weibo  string `json:"weibo"`
// 	Img    string `json:"img"`
// 	Avatar string `json:"avatar"`
// }

// type RspCategory struct {
// 	ID   uint   `json:"id"`
// 	Name string `json:"name"`
// }

// type RspArticle struct {
// 	ID        uint        `json:"id"`
// 	CreatedAt time.Time   `json:"created_at"`
// 	UpdatedAt time.Time   `json:"updated_at"`
// 	Title     string      `json:"title"`
// 	Desc      string      `json:"desc"`
// 	Content   string      `json:"content"`
// 	Img       string      `json:"img"`
// 	Category  RspCategory `json:"category"`
// }

// type RspFindArticle struct {
// 	ID        uint      `json:"id"`
// 	Title     string    `json:"title"`
// 	Name      string    `json:"name"`
// 	CreatedAt time.Time `json:"CreatedAt"`
// 	Desc      string    `json:"desc"`
// 	Content   string    `json:"content"`
// 	Img       string    `json:"img"`
// }

// type RspCommentUser struct {
// 	ID       uint   `json:"id"`
// 	Username string `json:"username"`
// }

// type RspComment struct {
// 	ID        uint           `json:"id"`
// 	CreatedAt time.Time      `json:"created_at"`
// 	Content   string         `json:"content"`
// 	User      RspCommentUser `json:"user"`
// }
