package model

import (
	"fmt"
	"goblog/utils"
	"time"

	_ "github.com/garyburd/redigo/redis"
	"github.com/go-redis/redis"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
)

var db *gorm.DB
var Redis *redis.Client
var err error

func InitDb() {
	db, err = gorm.Open(utils.Db, fmt.Sprintf("%s:%s@(%s%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		utils.DbUser,
		utils.DbPassWord,
		utils.DbHost,
		utils.DbPort,
		utils.DbName,
	))
	if err != nil {
		fmt.Println("连接数据库失败，请检查参数", err)
		return
	}

	defer db.Close()

	// 禁用默认表的复数形式
	db.SingularTable(true)
	// 迁移
	db.AutoMigrate(&User{}, &Article{}, &Category{}, &Comment{}, &UserArticle{}, &Profile{})

	// 设置连接池的最大闲置连接数
	db.DB().SetMaxIdleConns(10)
	// 设置连接池中的最大连接数量
	db.DB().SetMaxOpenConns(100)
	// 设置连接的最大复用时间
	db.DB().SetConnMaxLifetime(10 * time.Second)
}

func InitRedis() {
	Redis = redis.NewClient(&redis.Options{
		Addr:     utils.RedisAddr,
		Password: utils.RedisPassword,
		DB:       utils.RedisDB,
	})
	_, err = Redis.Ping().Result()
	if err != nil {
		fmt.Println("redis连接失败")
		return
	}
}
