package model

// 显式指定表名
func (UserArticle) TableName() string {
	return "user_article"
}

// 在连接表中，article_id 和 user_id 的组合通常构成复合主键，
type UserArticle struct {
	ArticleId uint `gorm:"primaryKey" json:"articleId"`
	UserId    uint `gorm:"primaryKey" json:"userId"`
}

// CreateUserArticle 在 user_article 连接表中创建一条新记录。
func CreateUserArticle(userArticle *UserArticle) error {
	// GORM 链式调用的 .Error 属性在成功时返回 nil，失败时返回 error。
	return db.Create(userArticle).Error
}

// DeleteMidByUserId 删除某个特定用户的所有关联记录。
func DeleteMidByUserId(userId uint) error {
	// 这会执行批量删除。传入结构体用于指定操作的表。
	return db.Where("user_id = ?", userId).Delete(&UserArticle{}).Error
}

// DeleteMidByArticleId 删除某篇特定文章的所有关联记录。
func DeleteMidByArticleId(articleId uint) error {
	return db.Where("article_id = ?", articleId).Delete(&UserArticle{}).Error
}
