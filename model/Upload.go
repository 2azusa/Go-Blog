// 文件路径: model/upload.go

package model

import (
	"context"
	"goblog/utils"
	"goblog/utils/errmsg"
	"mime/multipart"

	"github.com/qiniu/go-sdk/v7/auth/qbox"
	"github.com/qiniu/go-sdk/v7/storage"
)

// 从配置文件中读取七牛云对象存储的配置
var (
	AccessKey = utils.AccessKey
	SecretKey = utils.SecretKey
	Bucket    = utils.Bucket
	ImgUrl    = utils.QiniuServer
)

// UploadFile 将文件上传到七牛云
func UploadFile(file multipart.File, fileSize int64) (string, error) {
	putPolicy := storage.PutPolicy{
		Scope: Bucket,
	}
	mac := qbox.NewMac(AccessKey, SecretKey)
	upToken := putPolicy.UploadToken(mac)

	// 配置上传机房等信息
	cfg := storage.Config{
		Zone:          &storage.ZoneHuanan,
		UseCdnDomains: false,
		UseHTTPS:      false,
	}

	formUploader := storage.NewFormUploader(&cfg)
	ret := storage.PutRet{}
	putExtra := storage.PutExtra{}

	// 调用 SDK 的 PutWithoutKey 方法进行上传
	err := formUploader.PutWithoutKey(context.Background(), &ret, upToken, file, fileSize, &putExtra)
	if err != nil {
		// 如果上传失败，返回一个包装了详细信息的内部服务器错误
		return "", errmsg.ErrInternalServer.WithMsg("文件上传至七牛云失败: %v", err)
	}

	// 拼接最终的文件访问 URL
	url := ImgUrl + ret.Key
	return url, nil
}
