package model

import (
	"goblog/utils/errmsg"

	"gorm.io/gorm"
)

type Category struct {
	ID   uint   `gorm:"primary_key;auto_increment" json:"id"`
	Name string `gorm:"type:varchar(20);not null" json:"name"`
}

// 查询分类是否存在
func CheckCategory(name string) (code int) {
	var cate Category
	db.Model(&Category{}).Select("id").Where("name = ?", name).First(&cate)
	if cate.ID > 0 {
		return errmsg.ERROR_CATENAME_USED // 1001
	}
	return errmsg.SUCCESS
}

// 添加分类
func CreateCategory(data *Category) int {
	err = db.Model(&Category{}).Create(&data).Error
	if err != nil {
		return errmsg.ERROR // 500
	}
	return errmsg.SUCCESS
}

// 分页查询分类列表
func GetCategory(pageSize int, pageNum int) ([]Category, int, error) {
	var cates []Category
	var total int64
	err = db.Model(&Category{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	err = db.Model(&Category{}).Limit(pageSize).Offset((pageNum - 1) * pageSize).Find(&cates).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, 0, err
	}
	return cates, int(total), nil
}

// 编辑分类信息
func EditCategory(id int, data *Category) int {
	// 利用map集合更新
	var maps = make(map[string]any)
	maps["name"] = data.Name
	err = db.Model(&Category{}).Where("id = ?", id).Updates(maps).Error
	if err != nil {
		return errmsg.ERROR
	}
	return errmsg.SUCCESS
}

// 删除分类
func DeleteCategory(id int) int {
	err = db.Where("id = ?", id).Delete(&Category{}).Error
	if err != nil {
		return errmsg.ERROR
	}
	return errmsg.SUCCESS
}

// 根据id查找分类
func FindCategoryById(id int) (*Category, error) {
	var cate Category
	err = db.Model(&Category{}).Where("id = ?", id).Find(&cate).Error
	if err != nil {
		return nil, err
	}
	return &cate, nil
}
