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
