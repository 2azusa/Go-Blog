package main

import (
	"goblog/model"
	"goblog/router"
)

func main() {
	model.InitDb()
	model.InitRedis()
	router.InitRouter()
}
