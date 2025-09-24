package utils

import (
	"fmt"

	"gopkg.in/ini.v1"
)

// 解析配置文件并设置参数

var (
	AppMode  string
	HttpPort string
	JwtKey   string

	Db         string
	DbHost     string
	DbPort     string
	DbUser     string
	DbPassWord string
	DbName     string

	AccessKey   string
	SecretKey   string
	Bucket      string
	QiniuServer string

	RedisAddr     string
	RedisPassword string
	RedisDB       int

	ServerHost   string
	ServerPort   string
	FromEmail    string
	FromPassword string
)

func init() {
	// 解析配置文件config.ini
	file, err := ini.Load("config/config.ini")
	if err != nil {
		fmt.Println("配置文件读取错误，请检查文件路径", err)
	}

	LoadServer(file)
	LoadDate(file)
	LoadQiniu(file)
	LoadRedis(file)
	LoadEmailServer(file)
}

func LoadServer(file *ini.File) {
	AppMode = file.Section("server").Key("AppMode").MustString("debug")
	HttpPort = file.Section("server").Key("HttpPort").MustString(":80")
	JwtKey = file.Section("server").Key("JwtKey").MustString("45df45rds4")
}

func LoadDate(file *ini.File) {
	Db = file.Section("database").Key("Db").MustString("mysql")
	DbHost = file.Section("database").Key("DbHost").MustString("localhost")
	DbPort = file.Section("database").Key("DbPort").MustString(":3306")
	DbUser = file.Section("database").Key("DbUser").MustString("goblog_user")
	DbPassWord = file.Section("database").Key("DbPassword").MustString("123456")
	DbName = file.Section("database").Key("DbName").MustString("goblog")
}

func LoadQiniu(file *ini.File) {
	AccessKey = file.Section("qiniuyun").Key("AccessKey").String()
	SecretKey = file.Section("qiniuyun").Key("SecretKey").String()
	Bucket = file.Section("qiniuyun").Key("Bucket").String()
	QiniuServer = file.Section("qiniuyun").Key("QiniuServer").String()
}

func LoadRedis(file *ini.File) {
	var redisSection = file.Section("redis")
	RedisAddr = redisSection.Key("RedisAddr").String()
	RedisPassword = redisSection.Key("RedisPassword").String()
	RedisDB = redisSection.Key("RedisDb").MustInt(0)
}

func LoadEmailServer(file *ini.File) {
	var emailSection = file.Section("email")
	ServerHost = emailSection.Key("ServerHost").String()
	ServerPort = emailSection.Key("ServerPort").String()
	FromEmail = emailSection.Key("FromEmail").String()
	FromPassword = emailSection.Key("FromPassword").String()
}
