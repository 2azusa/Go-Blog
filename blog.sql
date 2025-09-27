/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 8.0.27 : Database - blog
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;
/*!40101 SET SQL_MODE=''*/;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 如果数据库不存在则创建
CREATE DATABASE /*!32312 IF NOT EXISTS*/`blog` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `blog`;

/*Table structure for table `category` */
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `category` */
-- 插入分类测试数据
insert  into `category`(`id`,`name`) values
(1,'JavaScript'),
(2,'Python'),
(3,'Go'),
(4,'Java'),
(5,'C++'),
(6,'Docker'),
(7,'Vue'),
(8,'Gin'),
(9,'Linux'),
(10,'数据库');


/*Table structure for table `user` */
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(50) NOT NULL, -- 密码字段长度增加到50以适应不同哈希
  `email` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `role` int DEFAULT '2',
  `status` varchar(12) DEFAULT 'Y',
  `code` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `user` */
-- 插入用户测试数据 (所有用户的密码明文都是 '123456')
insert  into `user`(`id`,`created_at`,`updated_at`,`deleted_at`,`username`,`password`,`email`,`role`,`status`,`code`) values
(1, NOW(), NOW(), NULL, 'admin', 'nbo6qwKOCLonuw==', 'admin@example.com', 1, 'Y', NULL),
(2, NOW(), NOW(), NULL, 'azusa', 'nbo6qwKOCLonuw==', 'azusa@azusa.com', 1, 'Y', NULL), -- 您要求添加的用户
(3, NOW(), NOW(), NULL, 'testuser', 'nbo6qwKOCLonuw==', 'test@example.com', 2, 'Y', NULL),
(4, NOW(), NOW(), NULL, 'editor', 'nbo6qwKOCLonuw==', 'editor@example.com', 2, 'Y', NULL),
(5, NOW(), NOW(), NULL, 'inactive_user', 'nbo6qwKOCLonuw==', 'inactive@example.com', 2, 'N', 'some-activation-code');


/*Table structure for table `profile` */
DROP TABLE IF EXISTS `profile`;
CREATE TABLE `profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `desc` varchar(200) DEFAULT NULL,
  `qq_chat` varchar(32) DEFAULT NULL,
  `we_chat` varchar(255) DEFAULT NULL,
  `weibo` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `img` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `avatar` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `profile` */
-- 为每个用户插入对应的个人资料
insert  into `profile`(`id`,`name`,`desc`,`qq_chat`,`we_chat`,`weibo`,`email`,`img`,`avatar`) values
(1,'admin','这是超级管理员的个人简介','10001','admin_wechat','admin_weibo','admin@example.com','http://tmnhs.top/Fhm3-EFy-RjLzRWxMdYvawnjHKP6','http://tmnhs.top/FgS7IOFzb--ID37v_1U7c7qAIr6G'),
(2,'azusa','Azusa Nakano, playing guitar!','10002','azusa_wechat','azusa_weibo','azusa@azusa.com','http://tmnhs.top/Fhm3-EFy-RjLzRWxMdYvawnjHKP6','http://tmnhs.top/FgS7IOFzb--ID37v_1U7c7qAIr6G'),
(3,'testuser','我是一个快乐的测试用户','10003','test_wechat','test_weibo','test@example.com','http://tmnhs.top/Fhm3-EFy-RjLzRWxMdYvawnjHKP6','http://tmnhs.top/FgS7IOFzb--ID37v_1U7c7qAIr6G'),
(4,'editor','我是一名内容编辑','10004','editor_wechat','editor_weibo','editor@example.com','http://tmnhs.top/Fhm3-EFy-RjLzRWxMdYvawnjHKP6','http://tmnhs.top/FgS7IOFzb--ID37v_1U7c7qAIr6G'),
(5,'inactive_user','我是一个尚未激活的用户','10005','inactive_wechat','inactive_weibo','inactive@example.com','http://tmnhs.top/Fhm3-EFy-RjLzRWxMdYvawnjHKP6','http://tmnhs.top/FgS7IOFzb--ID37v_1U7c7qAIr6G');


/*Table structure for table `article` */
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `cid` int NOT NULL,
  `desc` varchar(200) DEFAULT NULL,
  `content` longtext NOT NULL,
  `img` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_article_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `article` */
-- 插入文章测试数据
insert  into `article`(`id`,`created_at`,`updated_at`,`deleted_at`,`title`,`cid`,`desc`,`content`,`img`) values
(1,NOW(),NOW(),NULL,'Gin框架入门指南',8,'本指南将带你快速上手Go语言中最流行的Web框架Gin。','<p>Gin是一个用Go语言编写的HTTP Web框架。它具有类似Martini的API，但性能要好得多，这要归功于httprouter。如果你需要性能和良好的生产力，你会喜欢Gin。</p><pre class=\"language-go\"><code>package main\n\nimport \"github.com/gin-gonic/gin\"\n\nfunc main() {\n\tr := gin.Default()\n\tr.GET(\"/ping\", func(c *gin.Context) {\n\t\tc.JSON(200, gin.H{\n\t\t\t\"message\": \"pong\",\n\t\t})\n\t})\n\tr.Run() // listen and serve on 0.0.0.0:8080 (for windows \"localhost:8080\")\n}</code></pre>','http://tmnhs.top/FkRia_wJqn4YhgqYV3AqP2615Q7f'),
(2,NOW(),NOW(),NULL,'Docker容器化技术详解',6,'本文深入探讨了Docker的核心概念，包括镜像、容器和Dockerfile。','<p>Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的Linux机器上，也可以实现虚拟化。</p>','http://tmnhs.top/FoKFZ1Rs8HJLpU7ICmC-O-xTrT-J'),
(3,NOW(),NOW(),NULL,'Vue 3 Composition API实践',7,'通过实例学习Vue 3中强大的Composition API，构建可维护和可复用的组件。','<p>Composition API是一组基于函数的API，允许我们灵活地组合组件逻辑。它的出现是为了解决Vue 2中在处理大型组件时遇到的问题。</p>','http://tmnhs.top/Fhm3-EFy-RjLzRWxMdYvawnjHKP6'),
(4,NOW(),NOW(),NULL,'Python数据分析入门',2,'使用Pandas和NumPy库进行基本的数据清洗、处理和分析。','<p>Python凭借其强大的库生态系统，已成为数据科学和机器学习领域的首选语言。</p>','http://tmnhs.top/FkRia_wJqn4YhgqYV3AqP2615Q7f'),
(5,NOW(),NOW(),NULL,'MySQL索引优化技巧',10,'探讨如何通过创建和使用正确的索引来提升MySQL数据库的查询性能。','<p>索引是提高数据库性能的最有效方式。本文将介绍B-Tree索引、复合索引和索引下推等高级技巧。</p>','http://tmnhs.top/FoKFZ1Rs8HJLpU7ICmC-O-xTrT-J');


/*Table structure for table `user_article` */
DROP TABLE IF EXISTS `user_article`;
CREATE TABLE `user_article` (
  `user_id` int unsigned NOT NULL,
  `article_id` int unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `user_article` */
-- 插入用户与文章的作者关系
insert  into `user_article`(`user_id`,`article_id`) values
(1,1), -- admin 发表了文章1
(1,2), -- admin 发表了文章2
(2,3), -- azusa 发表了文章3
(4,4), -- editor 发表了文章4
(4,5); -- editor 发表了文章5


/*Table structure for table `comment` */
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `user_id` int unsigned NOT NULL,  -- 使用user_id关联用户
  `content` longtext NOT NULL,
  `article_id` int NOT NULL,
  `parent_id` int DEFAULT NULL,
  `status` smallint DEFAULT 1, -- 增加审核状态 1:通过 2:待审核
  PRIMARY KEY (`id`),
  KEY `idx_comment_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `comment` */
-- 插入评论测试数据
insert into `comment` (`id`,`created_at`,`updated_at`,`deleted_at`,`user_id`,`content`,`article_id`,`parent_id`,`status`) values
(1, NOW(), NOW(), NULL, 3, '这篇文章写得太好了，感谢博主分享！', 1, NULL, 1),
(2, NOW(), NOW(), NULL, 1, '谢谢你的支持！', 1, 1, 1), -- admin回复testuser
(3, NOW(), NOW(), NULL, 4, 'Composition API确实非常强大，解决了我们项目中的很多痛点。', 3, NULL, 1),
(4, NOW(), NOW(), NULL, 2, '是的，熟练使用后能极大地提升开发效率。', 3, 3, 1), -- azusa回复editor
(5, NOW(), NOW(), NULL, 3, 'Docker部分讲得很清晰，期待后续系列。', 2, NULL, 1);


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;