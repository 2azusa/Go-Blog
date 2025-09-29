package dto

type PageReq struct {
	PageNum  int `form:"pagenum" json:"pagenum" binding:"omitempty,gte=1"`
	PageSize int `form:"pagesize" json:"pagesize" binding:"omitempty,gte=1,lte=100"`
}

type ReqLogin struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type ReqRegister struct {
	Username string `json:"username" binding:"required,min=4,max=20"`
	Password string `json:"password" binding:"required,min=6,max=20"`
	Email    string `json:"email"    binding:"required,email"`
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

type ReqFindCate struct {
	PageReq
}

type ReqCategory struct {
	Name string `json:"name" binding:"required,min=2,max=20"`
}

type ReqFindArticle struct {
	PageReq
	Title string `form:"title" json:"title"`
}

type ReqArticle struct {
	Title   string `json:"title"   binding:"required,min=2,max=100"`
	Cid     uint   `json:"cid"     binding:"required,gte=1"`
	Desc    string `json:"desc"    binding:"required,max=200"`
	Content string `json:"content" binding:"required"`
	Img     string `json:"img"     binding:"omitempty,url"`
}

// type ReqFindComments struct {
// 	PageReq
// }

type ReqAddComment struct {
	ArticleID uint   `json:"article_id" binding:"required,gte=1"`
	Content   string `json:"content"    binding:"required,max=500"`
}
