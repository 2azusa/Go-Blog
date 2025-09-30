/*!40101 SET NAMES utf8 */;
/*!40101 SET SQL_MODE=''*/;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

USE `blog`;

TRUNCATE TABLE `comment`;
TRUNCATE TABLE `user_article`;
TRUNCATE TABLE `article`;
TRUNCATE TABLE `profile`;
TRUNCATE TABLE `user`;
TRUNCATE TABLE `category`;

/*Data for the table `category` */
INSERT INTO `category`(`id`,`name`) VALUES
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

/*Data for the table `user` */
INSERT INTO `user`(`id`, `created_at`, `updated_at`, `deleted_at`, `username`, `password`, `email`, `role`, `status`, `code`) VALUES
(1, NOW(), NOW(), NULL, 'admin', 'dbkRfD3NI78dLlzOXVCsZw==$Qc+U5BzxU5WN0ZyP7WuqJc/xcBgCLiKz6ZV1OGgCH/Y=', 'admin@example.com', 1, 'Y', NULL),
(2, NOW(), NOW(), NULL, 'azusa', 'dbkRfD3NI78dLlzOXVCsZw==$Qc+U5BzxU5WN0ZyP7WuqJc/xcBgCLiKz6ZV1OGgCH/Y=', 'azusa@azusa.com', 1, 'Y', NULL),
(3, NOW(), NOW(), NULL, 'testuser', 'dbkRfD3NI78dLlzOXVCsZw==$Qc+U5BzxU5WN0ZyP7WuqJc/xcBgCLiKz6ZV1OGgCH/Y=', 'test@example.com', 2, 'Y', NULL);

/*Data for the table `profile` */
INSERT INTO `profile`(`id`, `user_id`, `name`, `desc`, `we_chat`, `weibo`, `email`, `img`, `avatar`) VALUES
(1, 1, 'admin', '这是超级管理员的个人简介', 'admin_wechat', 'admin_weibo', 'admin@example.com', 'http://example.com/img.jpg', 'http://example.com/avatar.jpg'),
(2, 2, 'azusa', 'Azusa Nakano, playing guitar!', 'azusa_wechat', 'azusa_weibo', 'azusa@azusa.com', 'http://example.com/img.jpg', 'http://example.com/avatar.jpg'),
(3, 3, 'testuser', '我是一个快乐的测试用户', 'test_wechat', 'test_weibo', 'test@example.com', 'http://example.com/img.jpg', 'http://example.com/avatar.jpg');

/*Data for the table `article` */
INSERT INTO `article`(`id`, `created_at`, `updated_at`, `deleted_at`, `title`, `cid`, `desc`, `content`, `img`) VALUES
(1, NOW(), NOW(), NULL, 'Gin框架入门指南', 8, '本指南将带你快速上手Go语言中最流行的Web框架Gin。', '<p>Gin是一个用Go语言编写的HTTP Web框架。它具有类似Martini的API，但性能要好得多...</p>', 'http://example.com/gin.jpg'),
(2, NOW(), NOW(), NULL, 'Docker容器化技术详解', 6, '本文深入探讨了Docker的核心概念，包括镜像、容器和Dockerfile。', '<p>Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中...</p>', 'http://example.com/docker.jpg'),
(3, NOW(), NOW(), NULL, 'Vue 3 Composition API实践', 7, '通过实例学习Vue 3中强大的Composition API，构建可维护和可复用的组件。', '<p>Composition API是一组基于函数的API，允许我们灵活地组合组件逻辑...</p>', 'http://example.com/vue.jpg'),
(4, NOW(), NOW(), NULL, 'Python数据分析入门', 2, '使用Pandas和NumPy库进行基本的数据清洗、处理和分析。', '<p>Python凭借其强大的库生态系统，已成为数据科学和机器学习领域的首选语言。</p>', 'http://example.com/python.jpg'),
(5, NOW(), NOW(), NULL, 'MySQL索引优化技巧', 10, '探讨如何通过创建和使用正确的索引来提升MySQL数据库的查询性能。', '<p>索引是提高数据库性能的最有效方式。本文将介绍B-Tree索引、复合索引和索引下推等高级技巧。</p>', 'http://example.com/mysql.jpg');

/*Data for the table `user_article` */
-- 这里定义了用户和文章之间的多对多关系。
INSERT INTO `user_article`(`user_id`, `article_id`) VALUES
(1, 1), -- admin 发表了 'Gin框架入门指南'
(1, 2), -- admin 发表了 'Docker容器化技术详解'
(2, 3), -- azusa 发表了 'Vue 3 Composition API实践'
(2, 4), -- azusa 发表了 'Python数据分析入门'
(1, 5); -- admin 发表了 'MySQL索引优化技巧'


/*Data for the table `comment` */
INSERT INTO `comment`(`id`, `created_at`, `updated_at`, `deleted_at`, `commentator`, `content`, `article_id`, `parent_id`) VALUES
(1, NOW(), NOW(), NULL, 'testuser', '这篇文章写得太好了，感谢博主分享！', 1, NULL),
(2, NOW(), NOW(), NULL, 'admin', '谢谢你的支持！', 1, 1),
(3, NOW(), NOW(), NULL, 'azusa', 'Composition API确实非常强大，解决了我们项目中的很多痛点。', 3, NULL),
(4, NOW(), NOW(), NULL, 'admin', '是的，熟练使用后能极大地提升开发效率。', 3, 3),
(5, NOW(), NOW(), NULL, 'testuser', 'Docker部分讲得很清晰，期待后续系列。', 2, NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;