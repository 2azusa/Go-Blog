package middleware

import (
	"fmt"
	"math"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	retalog "github.com/lestrrat-go/file-rotatelogs"
	"github.com/rifflock/lfshook"
	"github.com/sirupsen/logrus"
)

// Logger 是一个 Gin 中间件，用于记录 HTTP 请求日志。
func Logger() gin.HandlerFunc {
	filePath := "log/log"                                          // 日志文件路径
	linkName := "latest_log.log"                                   // 最新日志文件的软链接名称
	src, err := os.OpenFile(filePath, os.O_RDWR|os.O_CREATE, 0755) // 打开或创建日志文件
	if err != nil {
		fmt.Println("err: ", err) // 如果打开文件出错，打印错误信息
	}
	// 创建日志实例
	logger := logrus.New()
	// 设置日志输出到文件
	logger.Out = src
	// 设置日志级别为 Debug
	logger.SetLevel(logrus.DebugLevel)
	// 配置日志文件按时间轮转
	logWriter, _ := retalog.New(
		filePath+"%Y%m%d.log",                  // 日志文件命名格式，按天分割
		retalog.WithMaxAge(7*24*time.Hour),     // 日志最长保存 7 天
		retalog.WithRotationTime(24*time.Hour), // 每天轮转一次
		retalog.WithLinkName(linkName),         // 创建软链接指向最新日志文件
	)
	// 创建 lfshook 的 WriterMap，将不同级别的日志写入同一个 logWriter
	writeMap := lfshook.WriterMap{
		logrus.InfoLevel:  logWriter,
		logrus.FatalLevel: logWriter,
		logrus.DebugLevel: logWriter,
		logrus.WarnLevel:  logWriter,
		logrus.ErrorLevel: logWriter,
		logrus.PanicLevel: logWriter,
	}
	// 创建 lfshook 钩子，并设置日志格式
	Hook := lfshook.NewHook(writeMap, &logrus.TextFormatter{
		TimestampFormat: "2006-01-02 15:04:05", // 时间戳格式
	})
	// 将钩子添加到 logrus 实例
	logger.AddHook(Hook)

	// 返回 Gin 处理函数
	return func(c *gin.Context) {
		startTime := time.Now()                                                                      // 请求开始时间
		c.Next()                                                                                     // 处理下一个中间件或路由
		stopTime := time.Since(startTime)                                                            // 请求处理耗时
		spendTime := fmt.Sprintf("%d ms", int(math.Ceil(float64(stopTime.Nanoseconds())/1000000.0))) // 耗时转换为毫秒
		hostName, err := os.Hostname()                                                               // 获取主机名
		if err != nil {
			hostName = "Unkown" // 如果获取失败，设置为 "Unkown"
		}
		statusCode := c.Writer.Status()     // HTTP 状态码
		clientIp := c.ClientIP()            // 客户端 IP
		userAgent := c.Request.UserAgent()  // 用户代理
		dataSize := max(c.Writer.Size(), 0) // 响应数据大小

		method := c.Request.Method   // 请求方法
		path := c.Request.RequestURI // 请求 URI

		// 使用 WithFields 添加日志字段
		entry := logger.WithFields(logrus.Fields{
			"HostName":  hostName,
			"status":    statusCode,
			"SpendTime": spendTime,
			"Ip":        clientIp,
			"Method":    method,
			"Path":      path,
			"DataSize":  dataSize,
			"Agent":     userAgent,
		})
		if len(c.Errors) > 0 {
			entry.Error(c.Errors.ByType(gin.ErrorTypePrivate).String())
		}
		if statusCode >= 500 {
			entry.Error()
		} else if statusCode >= 400 {
			entry.Warn()
		} else {
			entry.Info()
		}
	}
}
