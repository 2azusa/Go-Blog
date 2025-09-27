package model

// type Comment struct {
// 	gorm.Model
// 	Commentator string `gorm:"type:varchar(20);not null" json:"commentator"`
// 	Content     string `gorm:"type:longtext;not null" json:"content"`
// 	ArticleID   int    `gorm:"type:int;not null" json:"article_id"`
// 	ParentID    int    `gorm:"type:int" json:"parent_id"`
// }

// // 根据 id 删除评论
// func DeleteComment(id int) error {
// 	err = db.Where("id = ?", id).Delete(&Comment{}).Error
// 	if err != nil {
// 		return
// 	}
// 	return errmsg.SUCCESS
// }

// // DeleteComment 删除评论
// func DeleteComment(id int) error {
// 	if err := db.Where("id = ?", id).Delete(&Comment{}).Error; err != nil {
// 		return err
// 	}
// 	return nil
// }
