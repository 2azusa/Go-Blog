/*!40101 SET NAMES utf8 */;
/*!40101 SET SQL_MODE=''*/;

-- 禁用外键检查，以便能顺利清空表
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
INSERT INTO `category`(`id`, `name`) VALUES
(1, 'JavaScript'),
(2, 'Python'),
(3, 'Go'),
(4, 'Java'),
(5, 'C++'),
(6, 'Docker'),
(7, 'Vue'),
(8, 'Gin'),
(9, 'Linux'),
(10, '数据库');

/*
 * =================================================================
 * Data for `user` and `profile` tables
 * 
 * IMPORTANT:
 * - We are not setting `id` manually to allow auto-increment.
 * - The password hash 'dbkRfD3NI78dLlzOXVCsZw==$Qc+U5BzxU5WN0ZyP7WuqJc/xcBgCLiKz6ZV1OGgCH/Y='
 *   is generated from a common password (e.g., "123456") for testing purposes.
 * - We use variables (@user_id_x) to ensure the `user_id` in the `profile` table
 *   correctly matches the auto-generated `id` from the `user` table.
 * =================================================================
 */

-- User 1: admin
INSERT INTO `user`(`created_at`, `updated_at`, `username`, `password`, `email`, `role`, `status`) VALUES
(NOW(), NOW(), 'admin', 'dbkRfD3NI78dLlzOXVCsZw==$Qc+U5BzxU5WN0ZyP7WuqJc/xcBgCLiKz6ZV1OGgCH/Y=', 'admin@example.com', 1, 'Y');
SET @user_id_1 = LAST_INSERT_ID();
INSERT INTO `profile`(`created_at`, `updated_at`, `user_id`, `name`, `desc`, `qq_chat`, `we_chat`, `weibo`, `email`, `img`, `avatar`) VALUES
(NOW(), NOW(), @user_id_1, 'admin', '这是超级管理员的个人简介', 'admin_qq', 'admin_wechat', 'admin_weibo', 'admin@example.com', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2');

-- User 2: azusa
INSERT INTO `user`(`created_at`, `updated_at`, `username`, `password`, `email`, `role`, `status`) VALUES
(NOW(), NOW(), 'azusa', 'dbkRfD3NI78dLlzOXVCsZw==$Qc+U5BzxU5WN0ZyP7WuqJc/xcBgCLiKz6ZV1OGgCH/Y=', 'azusa@azusa.com', 1, 'Y');
SET @user_id_2 = LAST_INSERT_ID();
INSERT INTO `profile`(`created_at`, `updated_at`, `user_id`, `name`, `desc`, `qq_chat`, `we_chat`, `weibo`, `email`, `img`, `avatar`) VALUES
(NOW(), NOW(), @user_id_2, 'azusa', 'Azusa Nakano, playing guitar!', 'azusa_qq', 'azusa_wechat', 'azusa_weibo', 'azusa@azusa.com', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2');

-- User 3: testuser
INSERT INTO `user`(`created_at`, `updated_at`, `username`, `password`, `email`, `role`, `status`) VALUES
(NOW(), NOW(), 'testuser', 'dbkRfD3NI78dLlzOXVCsZw==$Qc+U5BzxU5WN0ZyP7WuqJc/xcBgCLiKz6ZV1OGgCH/Y=', 'test@example.com', 2, 'Y');
SET @user_id_3 = LAST_INSERT_ID();
INSERT INTO `profile`(`created_at`, `updated_at`, `user_id`, `name`, `desc`, `qq_chat`, `we_chat`, `weibo`, `email`, `img`, `avatar`) VALUES
(NOW(), NOW(), @user_id_3, 'testuser', '我是一个快乐的测试用户', 'test_qq', 'test_wechat', 'test_weibo', 'test@example.com', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2');

-- User 4: noob_master
INSERT INTO `user`(`created_at`, `updated_at`, `username`, `password`, `email`, `role`, `status`) VALUES
(NOW(), NOW(), 'noob_master', 'dbkRfD3NI78dLlzOXVCsZw==$Qc+U5BzxU5WN0ZyP7WuqJc/xcBgCLiKz6ZV1OGgCH/Y=', 'noob@example.com', 2, 'Y');
SET @user_id_4 = LAST_INSERT_ID();
INSERT INTO `profile`(`created_at`, `updated_at`, `user_id`, `name`, `desc`, `qq_chat`, `we_chat`, `weibo`, `email`, `img`, `avatar`) VALUES
(NOW(), NOW(), @user_id_4, 'NoobMaster', '刚入门的开发者，请多指教！', 'noob_qq', 'noob_wechat', 'noob_weibo', 'noob@example.com', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2');

-- User 5: code_ninja
INSERT INTO `user`(`created_at`, `updated_at`, `username`, `password`, `email`, `role`, `status`) VALUES
(NOW(), NOW(), 'code_ninja', 'dbkRfD3NI78dLlzOXVCsZw==$Qc+U5BzxU5WN0ZyP7WuqJc/xcBgCLiKz6ZV1OGgCH/Y=', 'ninja@example.com', 2, 'Y');
SET @user_id_5 = LAST_INSERT_ID();
INSERT INTO `profile`(`created_at`, `updated_at`, `user_id`, `name`, `desc`, `qq_chat`, `we_chat`, `weibo`, `email`, `img`, `avatar`) VALUES
(NOW(), NOW(), @user_id_5, 'CodeNinja', '潜心修炼编程之道的忍者。', 'ninja_qq', 'ninja_wechat', 'ninja_weibo', 'ninja@example.com', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2');

/*Data for the table `article` */
INSERT INTO `article`(`id`, `created_at`, `updated_at`, `title`, `cid`, `desc`, `content`, `img`) VALUES
(1, NOW(), NOW(), 'Gin框架入门指南', 8, '本指南将带你快速上手Go语言中最流行的Web框架Gin。', '<p>Gin是一个用Go语言编写的HTTP Web框架。它具有类似Martini的API，但性能要好得多...</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(2, NOW(), NOW(), 'Docker容器化技术详解', 6, '本文深入探讨了Docker的核心概念，包括镜像、容器和Dockerfile。', '<p>Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中...</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(3, NOW(), NOW(), 'Vue 3 Composition API实践', 7, '通过实例学习Vue 3中强大的Composition API，构建可维护和可复用的组件。', '<p>Composition API是一组基于函数的API，允许我们灵活地组合组件逻辑...</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(4, NOW(), NOW(), 'Python数据分析入门', 2, '使用Pandas和NumPy库进行基本的数据清洗、处理和分析。', '<p>Python凭借其强大的库生态系统，已成为数据科学和机器学习领域的首选语言。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(5, NOW(), NOW(), 'MySQL索引优化技巧', 10, '探讨如何通过创建和使用正确的索引来提升MySQL数据库的查询性能。', '<p>索引是提高数据库性能的最有效方式。本文将介绍B-Tree索引、复合索引和索引下推等高级技巧。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(6, NOW(), NOW(), 'JavaScript异步编程：从回调到Async/Await', 1, '全面解析JavaScript中的异步处理机制，包括回调函数、Promise和现代的Async/Await语法。', '<p>异步编程是JavaScript的核心。本文将带你一步步理解其演进过程，并掌握最佳实践。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(7, NOW(), NOW(), 'Linux常用命令大全', 9, '精选了100个Linux日常操作和管理中最高频使用的命令，并提供实用示例。', '<p>无论你是开发、运维还是测试，掌握这些Linux命令都将极大地提高你的工作效率。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(8, NOW(), NOW(), 'Java并发编程基础', 4, '介绍Java中线程、锁、线程池等核心概念，为编写健壮的多线程应用打下坚实基础。', '<p>Java的并发能力是其强大功能之一。本文将从JMM（Java内存模型）讲起，深入浅出地介绍并发编程。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(9, NOW(), NOW(), 'C++11新特性概览', 5, '本文介绍了C++11标准中引入的一些重要新特性，如Lambda表达式、智能指针和范围for循环。', '<p>C++11是C++语言发展史上的一个重要里程碑，它为这门古老的语言注入了新的活力。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2');

/*Data for the table `user_article` */
INSERT INTO `user_article`(`user_id`, `article_id`) VALUES
(@user_id_1, 1), -- admin 发表了 'Gin框架入门指南'
(@user_id_1, 2), -- admin 发表了 'Docker容器化技术详解'
(@user_id_2, 3), -- azusa 发表了 'Vue 3 Composition API实践'
(@user_id_2, 4), -- azusa 发表了 'Python数据分析入门'
(@user_id_1, 5), -- admin 发表了 'MySQL索引优化技巧'
(@user_id_2, 6), -- azusa 发表了 'JavaScript异步编程'
(@user_id_1, 7), -- admin 发表了 'Linux常用命令大全'
(@user_id_5, 8), -- code_ninja 发表了 'Java并发编程基础'
(@user_id_5, 9); -- code_ninja 发表了 'C++11新特性概览'

/*Data for the table `comment` */
INSERT INTO `comment`(`id`, `created_at`, `updated_at`, `commentator`, `content`, `article_id`, `parent_id`) VALUES
(1, NOW(), NOW(), 'testuser', '这篇文章写得太好了，感谢博主分享！', 1, NULL),
(2, NOW(), NOW(), 'admin', '谢谢你的支持！', 1, 1),
(3, NOW(), NOW(), 'azusa', 'Composition API确实非常强大，解决了我们项目中的很多痛点。', 3, NULL),
(4, NOW(), NOW(), 'admin', '是的，熟练使用后能极大地提升开发效率。', 3, 3),
(5, NOW(), NOW(), 'testuser', 'Docker部分讲得很清晰，期待后续系列。', 2, NULL),
(6, NOW(), NOW(), 'noob_master', '关于JS异步，我之前一直对Promise理解得不透彻，看完这篇文章豁然开朗！', 6, NULL),
(7, NOW(), NOW(), 'azusa', '很高兴能帮到你！Promise是现代JS开发的基础，一定要掌握好。', 6, 6),
(8, NOW(), NOW(), 'testuser', 'Linux命令太实用了，收藏了！', 7, NULL),
(9, NOW(), NOW(), 'admin', '有用就好，后续会分享更多Linux技巧。', 7, 8),
(10, NOW(), NOW(), 'noob_master', 'Java并发这块一直是我的弱项，博主讲得很清楚，入门了。', 8, NULL),
(11, NOW(), NOW(), 'code_ninja', '这只是基础部分，后面还有更深入的并发模型和工具，敬请期待。', 8, 10),
(12, NOW(), NOW(), 'azusa', 'C++11的智能指针真的太棒了，再也不用手动管理内存了。', 9, NULL);

-- 恢复外键检查
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;