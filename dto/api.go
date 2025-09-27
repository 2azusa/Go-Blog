package dto

import "time"

// =======================================
// 通用 DTO
// =======================================

type PageReq struct {
	PageNum  int `form:"pagenum" json:"pagenum" binding:"omitempty,gte=1"`
	PageSize int `form:"pagesize" json:"pagesize" binding:"omitempty,gte=1,lte=100"`
}

type RspUpload struct {
	Url string `json:"url"`
}

// =======================================
// 认证模块
// =======================================

type ReqRegister struct {
	Username string `json:"username" binding:"required,min=4,max=20"`
	Password string `json:"password" binding:"required,min=6,max=20"`
	Email    string `json:"email"    binding:"required,email"`
}

type ReqLogin struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type ReqLoginByEmail struct {
	Email string `json:"email" binding:"required,email"`
	Code  string `json:"code"  binding:"required,len=4"`
}

type ReqSendEmailForCode struct {
	Email string `json:"email" binding:"required,email"`
}

type ReqActiveEmail struct {
	Code string `form:"code" binding:"required"`
}

type RspLogin struct {
	User  RspUser `json:"user"`
	Token string  `json:"token"`
}

// =======================================
// 用户 & 个人资料模块
// =======================================

type ReqFindUser struct {
	PageReq
	Query string `form:"query" json:"query"`
}

type ReqAddUser struct {
	Username string `json:"username" binding:"required,min=4,max=20"`
	Password string `json:"password" binding:"required,min=6,max=20"`
	Email    string `json:"email"    binding:"required,email"`
	Role     int    `json:"role"     binding:"required,oneof=1 2"`
}

type ReqEditUser struct {
	Username string `json:"username" binding:"required,min=4,max=20"`
	Email    string `json:"email"    binding:"required,email"`
	Role     int    `json:"role"     binding:"required,oneof=1 2"`
}

type ReqUpdateProfile struct {
	Name   string `json:"name"   binding:"omitempty,max=50"`
	Desc   string `json:"desc"   binding:"omitempty,max=200"`
	WeChat string `json:"wechat" binding:"omitempty,max=50"`
	Weibo  string `json:"weibo"  binding:"omitempty,max=50"`
	Img    string `json:"img"    binding:"omitempty,url,max=255"`
	Avatar string `json:"avatar" binding:"omitempty,url,max=255"`
}

type RspUser struct {
	ID        uint      `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Role      int       `json:"role"`
}

type RspProfile struct {
	RspUser
	Name   string `json:"name"`
	Desc   string `json:"desc"`
	WeChat string `json:"wechat"`
	Weibo  string `json:"weibo"`
	Img    string `json:"img"`
	Avatar string `json:"avatar"`
}

// =======================================
// 分类模块
// =======================================

type ReqFindCate struct {
	PageReq
}

type ReqCategory struct {
	Name string `json:"name" binding:"required,min=2,max=20"`
}

type RspCategory struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

// =======================================
// 文章模块
// =======================================

type ReqFindArticle struct {
	PageReq
	Title string `form:"title" json:"title"`
}

type ReqArticle struct {
	Title   string `json:"title"   binding:"required,min=2,max=100"`
	Cid     int    `json:"cid"     binding:"required,gte=1"`
	Desc    string `json:"desc"    binding:"required,max=200"`
	Content string `json:"content" binding:"required"`
	Img     string `json:"img"     binding:"omitempty,url"`
}

type RspArticle struct {
	ID        uint        `json:"id"`
	CreatedAt time.Time   `json:"created_at"`
	UpdatedAt time.Time   `json:"updated_at"`
	Title     string      `json:"title"`
	Desc      string      `json:"desc"`
	Content   string      `json:"content"`
	Img       string      `json:"img"`
	Category  RspCategory `json:"category"`
}

// =======================================
// 评论模块
// =======================================

type ReqFindComments struct {
	PageReq
}

type ReqAddComment struct {
	ArticleID uint   `json:"article_id" binding:"required,gte=1"`
	Content   string `json:"content"    binding:"required,max=500"`
}

type RspCommentUser struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
}

type RspComment struct {
	ID        uint           `json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	Content   string         `json:"content"`
	User      RspCommentUser `json:"user"`
}

type RspFindArticle struct {
	ID        uint      `json:"id"`
	Title     string    `json:"title"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"CreatedAt"`
	Desc      string    `json:"desc"`
	Content   string    `json:"content"`
	Img       string    `json:"img"`
}
