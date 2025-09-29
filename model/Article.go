package model

import (
	"errors"
	"goblog/utils/errmsg"

	"gorm.io/gorm"
)

type Article struct {
	gorm.Model
	Title    string   `gorm:"type:varchar(100);not null" json:"title"`
	Cid      uint     `gorm:"notnull" json:"cid"`
	Desc     string   `gorm:"type:varchar(200)" json:"desc"`
	Content  string   `gorm:"type:longtext;not null" json:"content"`
	Img      string   `gorm:"type:varchar(200)" json:"img"`
	Category Category `gorm:"foreignkey:Cid"`
	Comments []Comment
}

type Comment struct {
	gorm.Model
	Commentator string `gorm:"type:varchar(20);not null" json:"commentator"`
	Content     string `gorm:"type:longtext;not null" json:"content"`
	ArticleID   uint   `gorm:"not null" json:"article_id"`
	ParentID    uint
}

// CreateArticle 添加文章
func CreateArticle(data *Article) error {
	if err := db.Create(&data).Error; err != nil {
		return err
	}
	return nil
}

// CreateComment 添加评论
func CreateComment(articleId uint, data *Comment) error {
	var article Article
	if err := db.First(&article, articleId).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errmsg.ErrArticleNotExist
		}
		return err
	}
	data.ArticleID = articleId
	if err := db.Create(&data).Error; err != nil {
		return err
	}
	return nil
}

// GetCommentsByArticleId 查询文章下的所有评论
func GetCommentsByArticleId(id uint) ([]Comment, error) {
	var article Article
	if err := db.First(&article, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errmsg.ErrArticleNotExist
		}
		return nil, err
	}

	var comments []Comment
	err := db.Where("article_id = ?", id).Find(&comments).Error
	if err != nil {
		return nil, err
	}

	if len(comments) == 0 {
		return nil, errmsg.ErrArticleNoComment // 200
	}

	return comments, nil
}

// DeleteComment 删除评论
func DeleteComment(id uint) error {
	if err := db.Where("id = ?", id).Delete(&Comment{}).Error; err != nil {
		return err
	}
	return nil
}

// GetArticles 分页查询文章列表
func GetArticles(title string, pageSize int, pageNum int) ([]Article, int, error) {
	var articles []Article
	var total int64
	DB := db.Model(&Article{})

	if title != "" {
		DB = DB.Where("title LIKE ?", "%"+title+"%")
	}

	if err := DB.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := DB.Limit(pageSize).Offset((pageNum - 1) * pageSize).Preload("Category").Find(&articles).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, 0, err
	}

	return articles, int(total), nil
}

// GetCateArticle 查询分类下的所有文章
func GetCateArticle(id uint, pageSize int, pageNum int) ([]Article, int64, error) {
	var cate Category
	if err := db.First(&cate, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, 0, errmsg.ErrCateNotExist
		}
		return nil, 0, err
	}

	var cateArticleList []Article
	var total int64
	DB := db.Model(&Article{}).Where("cid = ?", id)

	if err := DB.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := DB.Limit(pageSize).Offset((pageNum - 1) * pageSize).Find(&cateArticleList).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, 0, err
	}

	return cateArticleList, total, nil
}

// GetArticleInfo 查询单个文章详细信息
func GetArticleInfo(id uint) (*Article, error) {
	var article Article
	err := db.Preload("Category").Preload("Comments").First(&article, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errmsg.ErrArticleNotExist
		}
		return nil, err
	}
	return &article, nil
}

// EditArticle 编辑文章信息
func EditArticle(id uint, data *Article) error {
	var article Article
	if err := db.First(&article, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errmsg.ErrArticleNotExist
		}
		return err
	}

	updates := map[string]any{
		"title":   data.Title,
		"cid":     data.Cid,
		"desc":    data.Desc,
		"content": data.Content,
		"img":     data.Img,
	}
	if err := db.Model(&Article{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return err
	}
	return nil
}

// DeleteArticle 删除文章 (使用事务)
func DeleteArticle(id uint) error {
	return db.Transaction(func(tx *gorm.DB) error {
		var article Article
		if err := tx.First(&article, id).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return errmsg.ErrArticleNotExist
			}
			return err
		}

		// 删除文章下的所有评论
		if err := tx.Where("article_id = ?", id).Delete(&Comment{}).Error; err != nil {
			return err
		}

		// 删除文章本身
		if err := tx.Delete(&Article{}, id).Error; err != nil {
			return err
		}

		// 如果有其他关联表（如 UserArticle），也应在此处删除
		if err := tx.Where("article_id = ?", id).Delete(&UserArticle{}).Error; err != nil {
			return err
		}

		return nil
	})
}
