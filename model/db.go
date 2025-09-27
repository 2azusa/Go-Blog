package model

import (
	"context"
	"fmt"
	"goblog/utils"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

var db *gorm.DB
var Redis *redis.Client

// InitDb 初始化数据库连接 (GORM v2)
func InitDb() {
	// 构造 DSN (Data Source Name)
	dsn := fmt.Sprintf("%s:%s@tcp(%s%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		utils.DbUser,
		utils.DbPassWord,
		utils.DbHost,
		utils.DbPort,
		utils.DbName,
	)

	// 使用新的方式连接数据库，并传入配置
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		// 配置项统一管理
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true, // 设置为单数表名
		},
	})
	if err != nil {
		log.Fatalf("连接数据库失败，请检查参数: %v", err)
	}

	// 迁移 schema
	err = db.AutoMigrate(&User{}, &Article{}, &Category{}, &Comment{}, &Profile{})
	if err != nil {
		log.Fatalf("数据库迁移失败: %v", err)
	}

	// 获取底层的 sql.DB 对象以配置连接池
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("获取数据库底层连接失败: %v", err)
	}

	// 设置连接池的最大闲置连接数
	sqlDB.SetMaxIdleConns(10)
	// 设置连接池中的最大连接数量
	sqlDB.SetMaxOpenConns(100)
	// 设置连接的最大复用时间
	sqlDB.SetConnMaxLifetime(10 * time.Second)
}

// InitRedis 初始化 Redis 连接 (适配 go-redis/v9)
func InitRedis() {
	Redis = redis.NewClient(&redis.Options{
		Addr:     utils.RedisAddr,
		Password: utils.RedisPassword,
		DB:       utils.RedisDB,
	})

	_, err := Redis.Ping(context.Background()).Result()
	if err != nil {
		log.Fatalf("Redis 连接失败: %v", err)
	}
}
