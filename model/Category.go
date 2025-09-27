package model

import (
	"errors"
	"goblog/utils/errmsg"

	"gorm.io/gorm"
)

type Category struct {
	ID   uint   `gorm:"primary_key;auto_increment" json:"id"`
	Name string `gorm:"type:varchar(20);not null;unique" json:"name"`
}

// CheckCategoryExists 检查分类名是否存在
func CheckCategoryExists(name string) (bool, error) {
	var cate Category
	err := db.Select("id").Where("name = ?", name).First(&cate).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil // 不存在，不是一个错误
		}
		return false, err // 查询数据库时发生其他错误
	}
	return true, nil // 找到了，说明已存在
}

// CreateCategory 添加分类
func CreateCategory(data *Category) error {
	// 创建前先检查分类名是否已存在
	exists, err := CheckCategoryExists(data.Name)
	if err != nil {
		return err // 检查过程中发生数据库错误
	}
	if exists {
		return errmsg.ErrCateNameUsed // 分类名已存在
	}

	return db.Create(&data).Error
}

// GetCategory 分页查询分类列表
func GetCategory(pageSize int, pageNum int) ([]Category, int, error) {
	var cates []Category
	var total int64

	// 先 Count
	if err := db.Model(&Category{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	// 再 Find
	err := db.Model(&Category{}).Limit(pageSize).Offset((pageNum - 1) * pageSize).Find(&cates).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, 0, err
	}

	return cates, int(total), nil
}

// EditCategory 编辑分类信息
func EditCategory(id uint, data *Category) error {
	// 首先，检查要编辑的分类是否存在
	var cate Category
	if err := db.First(&cate, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errmsg.ErrCateNotExist
		}
		return err
	}

	// 检查新的分类名是否与除自己以外的其他分类冲突
	var conflictCate Category
	err := db.Where("name = ? AND id != ?", data.Name, id).First(&conflictCate).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err // 查询时出错
	}
	if conflictCate.ID > 0 {
		return errmsg.ErrCateNameUsed // 新名称已被其他分类使用
	}

	// 使用 map 更新
	updates := map[string]interface{}{"name": data.Name}
	return db.Model(&Category{}).Where("id = ?", id).Updates(updates).Error
}

// DeleteCategory 删除分类
func DeleteCategory(id uint) error {
	// 删除前先检查分类是否存在
	var cate Category
	if err := db.First(&cate, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errmsg.ErrCateNotExist
		}
		return err
	}
	// TODO: 在这里可以添加业务逻辑，例如，如果分类下有文章，是否允许删除
	// ...

	return db.Where("id = ?", id).Delete(&Category{}).Error
}

// FindCategoryById 根据id查找分类
func FindCategoryById(id uint) (*Category, error) {
	var cate Category
	// 使用 First，如果找不到记录会返回 gorm.ErrRecordNotFound
	err := db.First(&cate, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errmsg.ErrCateNotExist
		}
		return nil, err
	}
	return &cate, nil
}
