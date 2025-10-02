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
(1, NOW(), NOW(), 'Gin框架入门指南', 8, '本指南将带你快速上手Go语言中最流行的Web框架Gin。', '<p>Gin 是一个用 Go 语言编写的高性能 HTTP Web 框架。它以其出色的性能和简洁的 API 而闻名。本教程将引导您完成 Gin 的安装、项目初始化，并运行您的第一个 API，帮助您轻松入门 Web 服务开发。</p><h3>核心特性</h3><ul><li><strong>快速：</strong>基于 Radix 树的路由，内存占用极小。</li><li><strong>中间件支持：</strong>传入的 HTTP 请求可以由一系列中间件和最终操作来处理。</li><li><strong>JSON 验证：</strong>可以验证请求中的 JSON 数据。</li><li><strong>路由组：</strong>更好地组织路由，例如，可以将需要授权的路由分组。</li><li><strong>错误管理：</strong>提供了一种方便的方式来收集 HTTP 请求期间发生的所有错误。</li></ul><h3>安装与设置</h3><p>首先，确保您已经安装了 Go 1.23 或更高版本。然后，通过以下命令获取 Gin：</p><pre><code>go get -u github.com/gin-gonic/gin</code></pre><p>创建一个新的项目目录并初始化 Go 模块：</p><pre><code>mkdir my-gin-app && cd my-gin-app\ngo mod init example.com/my-gin-app</code></pre><h3>第一个 "Hello, World!" 程序</h3><p>创建一个 `main.go` 文件，并添加以下代码：</p><pre><code>package main\n\nimport (\n    "net/http"\n    "github.com/gin-gonic/gin"\n)\n\nfunc main() {\n    r := gin.Default()\n    r.GET("/ping", func(c *gin.Context) {\n        c.JSON(http.StatusOK, gin.H{\n            "message": "pong",\n        })\n    })\n    r.Run() // 默认在 :8080 上监听和服务\n}</code></pre><p>运行此程序，然后访问 `http://localhost:8080/ping`，您将看到一个 JSON 响应。这就是您使用 Gin 构建的第一个 API！</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(2, NOW(), NOW(), 'Docker容器化技术详解', 6, '本文深入探讨了Docker的核心概念，包括镜像、容器和Dockerfile。', '<p>Docker 是一种开源的应用容器引擎，让开发者可以将应用以及依赖包打包到一个可移植的容器中，然后发布到任何流行的 Linux 或 Windows 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。</p><h3>Docker 的核心组件</h3><ul><li><strong>Docker 客户端 (Client):</strong> 用户通过客户端与 Docker 守护进程进行交互。</li><li><strong>Docker 守护进程 (Daemon):</strong> 负责监听 Docker API 请求和管理 Docker 对象，如镜像、容器、网络和卷。</li><li><st[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHGZ1abiR_h6bz-kQORAfZruph4mC9V8b8uLBLhkHRIkO6mcM88yDb69XnKo9hWoKObdsHwAOYNnmbf2EZuL2tOVSLBEICvwaz1rEMV_omyJT4_8CG0-TRYTYTYIJfOxN2TkvPWynTQzJAXAL0BJFp8QlAGCwkiCfJxWF9o6ExnAcLlR3jNQjsIAImieScsEH8SH6NC)]rong>Docker 镜像 (Image):</strong> 一个只读的模板，包含了运行应用程序所需的所有内容。</li><li><strong>Docker 容器 (Container):</strong> 镜像的运行实例。</li><li><strong>Docker 仓库 (Registry):</strong> 用于存储和分发 Docker 镜像。</li></ul><h3>工作流程</h3><p>Docker 的工作流程通常是：构建镜像 -> 推送镜像到仓库 -> 从仓库拉取镜像 -> 运行容器。通过一个 `Dockerfile` 文件，用户可以定义构建镜像的步骤。例如：</p><pre><code># 使用官方 Python 运行时作为父镜像\nFROM python:3.8-slim\n\n# 将工作目录设置为 /app\nWORKDIR /app\n\n# 将当前目录内容复制到容器的 /app 中\nADD . /app\n\n# 安装 requirements.txt 中指定的任何需要的包\nRUN pip install --no-cache-dir -r requirements.txt\n\n# 使端口 80 对此容器外部可用\nEXPOSE 80\n\n# 定义环境变量\nENV NAME World\n\n# 在容器启动时运行 app.py\nCMD ["python", "app.py"]</code></pre><p>这个 Dockerfile 定义了一个简单的 Python 应用环境。通过 `docker build` 命令可以构建出镜像，然后通过 `docker run` 来启动一个容器实例。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(3, NOW(), NOW(), 'Vue 3 Composition API实践', 7, '通过实例学习Vue 3中强大的Composition API，构建可维护和可复用的组件。', '<p>Vue 3 引入的 Composition API 是一组新的、基于函数的 API，旨在解决大型应用中逻辑组织和复用性的问题。它允许我们将相关的逻辑代码组织在一起，而不是像在 Options API 中那样分散在 `data`、`methods`、`computed` 等选项中。</p><h3>核心概念</h3><ul><li><strong>`setup` 函数:</strong> 是 Composition API 的入口点。它在组件创建之前执行，一旦 props 被解析，就作为组合式 API 的入口。</li><li><strong>`ref` 和 `reactive`:</strong> 用于创建响应式数据。`ref` 用于创建单个值的响应式引用，而 `reactive` 用于创建响应式对象。</li><li><st[[2](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQE_gt3x2ZtAEM6J0gGs9URSfBLGmfpidORjmWy6-CbkJBD8ll5kM5802qAAK4os72g1w5BhDhnfluSZ79UIPZ2rm2YIFb1BClV6DuVJhzJ0GYAmAhTDMq8z6ErnaiK63lpfcaoITUB_lptTXrLUNNBc)]rong>`computed`:</strong> 用于创建计算属性，它会根据其依赖的响应式数据自动更新。</li><li><strong>`watch` 和 `watchEffect`:</strong> 用于侦听响应式数据的变化并执行副作用。`watch` 懒执行副作用，而 `watchEffect` 立即执行。</li></ul><h3>实践示例：一个计数器组件</h3><p>下面是一个使用 Composition API 编写的简单计数器组件：</p><pre><code>&lt;template&gt;\n  &lt;div&gt;\n    &lt;p&gt;Count: {{ count }}&lt;/p&gt;\n    &lt;p&gt;Double Count: {{ doubleCount }}&lt;/p&gt;\n    &lt;button @click="increment"&gt;Increment&lt;/button&gt;\n  &lt;/div&gt;\n&lt;/template&gt;\n\n&lt;script&gt;\nimport { ref, computed } from \'vue\';\n\nexport default {\n  setup() {\n    const count = ref(0);\n    const doubleCount = computed(() =&gt; count.value * 2);\n\n    function increment() {\n      count.value++;\n    }\n\n    return {\n      count,\n      doubleCount,\n      increment,\n    };\n  },\n};\n&lt;/script&gt;</code></pre><p>在这个例子中，所有与计数器相关的逻辑（状态 `count`、计算属性 `doubleCount` 和方法 `increment`）都被组织在了 `setup` 函数中，使得代码更加内聚和可读。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(4, NOW(), NOW(), 'Python数据分析入门', 2, '使用Pandas和NumPy库进行基本的数据清洗、处理和分析。', '<p>Python 已成为数据分析领域的首选语言，这主要归功于其强大的库生态系统，特别是 Pandas 和 NumPy。本教程将介绍如何使用这两个库进行基本的据分析。</p><h3>NumPy：数值计算的基础</h3><p>NumPy（Numerical Python）是 Python 科学计算的核心库。它提供了一个强大的 N 维数组对象，以及用于处理这些数组的函数。NumPy 数组的运算效率远高于 Python 的列表。</p><pre><code>import numpy as np\n\n# 创建一个 NumPy 数组\narr = np.array([1, 2, 3, 4, 5])\n\n# 对数组中的每个元素进行数学运算\nprint(arr * 2)  # 输出: [ 2  4  6  8 10]</code></pre><h3>Pandas：强大的数据分析工具集</h3><p>Pandas 基于 NumPy 构建，提供了两种主要的数据结构：<strong>Series</strong>（一维）和 <strong>DataFrame</strong>（二维）。 DataFrame 类[[3](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHBzsyz5owBNYwBahj1QVlau_CGQ8vzahIFaesw-WOjQ0aaesV44_9l3EJOIa-pyp2fLYXTC6MakzyR7v5FiTnFMJbMjigOiRezSwOcaoDwSG1ZZgOhOqtCFSucpWstEIY7BttlIDQtmbO8NYxZY5jKV8_E)][[4](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQGbDg1xYQqvZpOEQKoetOQtqyycxOKAXkaTFLVPP398fq-6l5kMRPACP92WRUxSyIZaJ6NsWN8yrdg7WIluT2iPMQmO58idZVjaQCubT4_UFrEp9ha80ogi-pLBefFUTYxZE0_ID8fhXyWWkyCeLhbtHw%3D%3D)]似于电子表格或 SQL 表，是进行数据分析最常用的数据结构。</p><pre><code>import pandas as pd\n\n# 创建一个 DataFrame\ndata = {\'Name\': [\'Alice\', \'Bob\', \'Charlie\'], \'Age\': [25, 30, 35]}\ndf = pd.DataFrame(data)\n\n# 显示 DataFrame 的基本信息\nprint(df.info())\n\n# 选择特定的列\nprint(df[\'Name\'])\n\n# 进行数据筛选\nprint(df[df[\'Age\'] > 28])</code></pre><p>通过 Pandas，您可以轻松地读取和写入各种格式的数据（如 CSV、Excel），进行数据清洗、转换、合并和可视化，是数据分析工作流程中不可或缺的工具。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(5, NOW(), NOW(), 'MySQL索引优化技巧', 10, '探讨如何通过创建和使用正确的索引来提升MySQL数据库的查询性能。', '<p>在 MySQL 中，索引是提高数据库查询性能的最有效方法之一。一个好的索引策略可以让数据检索速度提升几个数量级。本文将探讨一些核心的 MySQL 索引优化技巧。</p><h3>选择合适的索引类型</h3><ul><li><strong>B-Tree 索引：</strong>最常见的索引类型，适用于全键值、键值范围或键前缀查找。</li><li><strong>哈希索引：</strong>只适用于等值查询，不支持范围查询。</li><li><strong>全文索引：</strong>用于在文本数据中进行关键词搜索。</li></ul><h3>索引设计的原则</h3><ol><li><strong>独立的列：</strong>索引列不能是表达式的一部分，也不能是函数的参数。例如，`WHERE column + 1 = 5` 将不会使用 `column` 上的索引。</li><li><strong>选择区分度高的列：</strong>选择那些具有更多唯一值的列作为索引，这样索引的效果会更好。</li><li><strong>前缀索引：</strong>对于较长的字符串列，可以只索引其前缀部分，以节省索引空间和提高效率。</li><li><strong>复合索引：</strong>当查询条件涉及多个列时，创建复合索引通常比创建多个单列索引更有效。复合索引的列顺序非常重要，应将最常用于筛选的列放在最前面。</li></ol><h3>使用 EXPLAIN 分析查询</h3><p>`EXPLAIN` 是一个强大的工具，可以用来分析 `SELECT` 查询的执行计划。通过 `EXPLAIN` 的输出，我们可以了解 MySQL 是如何使用索引来执行查询的，从而发现潜在的性能问题。</p><pre><code>EXPLAIN SELECT * FROM users WHERE username = \'admin\';</code></pre><p>通过分析 `type`、`key`、`rows` 等字段，可以判断查询是否有效地利用了索引。例如，`type` 为 `ALL` 表示全表扫描，这通常是需要优化的信号。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(6, NOW(), NOW(), 'JavaScript异步编程：从回调到Async/Await', 1, '全面解析JavaScript中的异步处理机制，包括回调函数、Promise和现代的Async/Await语法。', '<p>JavaScript 是一门单线程语言，但通过其异步编程模型，可以处理耗时操作（如网络请求、文件读写）而不会阻塞主线程。本文将回顾 JavaScript 异步编程的演进历程。</p><h3>1. 回调函数 (Callbacks)</h3><p>回调函数是异步编程最早的解决方案。一个函数作为参数传递给另一个函数，在异步操作完成后被调用。</p><pre><code>function fetchData(callback) {\n  setTimeout(() =&gt; {\n    callback(\'Data received\');\n  }, 1000);\n}\n\nfetchData(data =&gt; {\n  console.log(data);\n});</code></pre><p>回调函数的主要问题是“回调地狱”（Callback Hell），当多个异步操作相互依赖时，会导致代码层层嵌套，难以阅读和维护。</p><h3>2. Promise</h3><p>Promise 的出现是为了解决回调地狱的问题。Promise 是一个表示异步操作最终完成或失败的对象。它有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。</p><pre><co[[5](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQG-fR-SLudPMIv9D0w0KpgYam5dO83LIBqwqnzrFrNaJlMUihwTp1kEyWIG8KUUd9t6cKz-ekUKIl9ltZV_KKnv7lE_4TEax9jKiTqJsOWc5qHgKVV1pDrQQ_alE2U5dFJbatgZ4jPVsKpnGbyqfEIJYpj5lliMxCbsNP0xMryaiERXWHgqmQk%3D)]de>function fetchData() {\n  return new Promise((resolve, reject) =&gt; {\n    setTimeout(() =&gt; {\n      resolve(\'Data received\');\n    }, 1000);\n  });\n}\n\nfetchData()\n  .then(data =&gt; console.log(data))\n  .catch(error =&gt; console.error(error));</code></pre><p>通过 `.then()` 方法链，可以更好地组织异步代码。</p><h3>3. Async/Await</h3><p>Async/Await 是建立在 Promise 之上的语法糖，它使异步代码看起来更像是同步代码，从而更易于理解和编写。</p><pre><code>async function displayData() {\n  try {\n    const data = await fetchData();\n    console.log(data);\n  } catch (error) {\n    console.error(error);\n  }\n}\n\ndisplayData();</code></pre><p>`async` 函数返回一个 Promise。`await` 关键字只能在 `async` 函数内部使用，它会暂停函数的执行，直到 Promise 被解决。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(7, NOW(), NOW(), 'Linux常用命令大全', 9, '精选了100个Linux日常操作和管理中最高频使用的命令，并提供实用示例。', '<p>掌握常用的 Linux 命令是高效使用该操作系统的关键。无论您是开发人员、系统管理员还是普通用户，这些命令都将极大地提高您的工作效率。 以下是一[[6](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQEd_CVIm_cphg3_-CtlUzG2YiMzfBzYoLDsFm6tp-gyN24vzXSbtCoMLZ4hdxIXO2ggo8CZVQJH8fDQbSwHwIdKwtYdsJAiZpfHLIG3kqUIzjDwRnJ1mj8_kJHkrWZyiGCljPKXcTbifo7qNliOb4IEz6c%3D)]些最基本和最常用的命令。</p><h3>文件和目录操作</h3><ul><li><strong>`ls`</strong>: 列出目录内容。常用选项：`-l` (详细列表), `-a` (显示所有文件，包括隐藏文件)。</li><li><strong>`cd`</strong>: 切换目录。`cd ~` 进入主目录，`cd ..` 返回上一级目录。</li><li><strong>`pwd`</strong>: 显示当前工作目录的路径。</li><li><strong>`cp`</strong>: 复制文件或目录。`cp source destination`</li><li><strong>`mv`</strong>: 移动或重命名文件或目录。`mv old_name new_name`</li><li><strong>`rm`</strong>: 删除文件或目录。常用选项：`-r` (递归删除), `-f` (强制删除)。</li><li><st[[7](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQGGaHInm3yKzbiRCCAcN8XH_B9yCnND7ZOxMn5o0qJnKMvpXr-_tvEQHZjR-bscGW_y0Dh5e8DQRB4FHhOSsDxSUbNLnBl765Far_PJRoUlznE84nfis2r7FmVJLbH5m2mbZ3J-3RtLSUtQ6LVWLWrwXFp0Mx8%3D)]rong>`mkdir`</strong>: 创建新目录。</li></ul><h[[7](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQGGaHInm3yKzbiRCCAcN8XH_B9yCnND7ZOxMn5o0qJnKMvpXr-_tvEQHZjR-bscGW_y0Dh5e8DQRB4FHhOSsDxSUbNLnBl765Far_PJRoUlznE84nfis2r7FmVJLbH5m2mbZ3J-3RtLSUtQ6LVWLWrwXFp0Mx8%3D)]3>文本处理</h3><ul><li><strong>`cat`</strong>: 查看文件内容。</li><li><strong>`grep`</strong>: 在文件中搜索指定的模式。`grep "pattern" filename`</li><li><strong>`sed`</strong>: 流编辑器，用于对文本进行过滤和转换。</li><li><strong>`awk`</strong>: 一种强大的文本处理工具。</li></ul><h3>系统管理</h3><ul><li><strong>`ps`</strong>: 显示当前进程。</li><li><strong>`top`</strong>: 实时显示系统进程和资源使用情况。</li><li><strong>`kill`</strong>: 终止进程。</li><li><strong>`df`</strong>: 显示磁盘空间使用情况。</li><li><st[[8](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQH4Y342rU4pKC_ADt2ujvuY2nk7jYaPu8cfCahX7V-oCOLLlv_DDd94KoNJunCJFWhbN9uruFRdTu0TTBDLBd3obNe6cqUh3oli4O59W4wIIMjNUCVEvJaJWSD0bW25EnG9Pd1yb7HAKIAbeXp5mILlpKkq9nmF)]rong>`free`</strong>: 显示内存使用情况。</li></ul><p>这只是冰山一角，Linux 提供了数千个命令来完成各种任务。通过 `man` 命令 (例如 `man ls`)，您可以查看任何命令的详细手册页。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(8, NOW(), NOW(), 'Java并发编程基础', 4, '介绍Java中线程、锁、线程池等核心概念，为编写健壮的多线程应用打下坚实基础。', '<p>Java 平台提供了强大的并发编程支持，使得开发者能够构建高性能、高吞吐量的应用程序。理解并发编程的基础概念对于编写健壮的多线程应用至关重要。</p><h3>核心概念</h3><ul><li><strong>进程与线程：</strong>进程是程序的一次执行过程，是系统进行资源分配和调度的基本单位。 线程是比[[9](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQE_boXRJfQTHVxq9JwmIVzr6f60-MRiKZPPW5tlySwD9VOjqBkSNiIK2jzd_K5h2pwJnrKGXdZ1Vssgw58BETPxrM6K5-Zl_nz0WtTV42VDi0PiMxdgOOyljnGwslPyp0xFB1iKtw%3D%3D)]进程更小的执行单位，一个进程可以包含多个线程，它们共享进程的资源。</li><li><strong>线程安全：</strong>当多个线程访问一个对象时，如果不需要考虑这些线程在运行时环境下的调度和交替执行，也不需要进行额外的同步，或者在调用方进行任何其他的协调操作，调用这个对象的行为都可以获得正确的结果，那这个对象就是线程安全的。</li><li><strong>原子性、可见性和有序性：</strong>这是并发编程中的三个重要特性。原子性指一个操作是不可中断的。可见性指当一个线程修改了共享变量的值，其他线程能够立即得知这个修改。有序性指程序执行的顺序按照代码的先后顺序执行。</li></ul><h3>同步机制</h3><p>Java 提供了多种同步机制来保证线程安全：</p><ul><li><strong>`synchronized` 关键字：</strong>可以用于方法或代码块，它能保证在同一时刻，只有一个线程可以执行被 `synchronized` 修饰的代码。</li><li><strong>`volatile` 关键字：</strong>保证了共享变量的可见性，但不能保证原子性。</li><li><strong>锁 (Lock)：</strong>`java.util.concurrent.locks` 包提供了更灵活的锁机制，如 `ReentrantLock`。</li></ul><h3>线程池</h3><p>频繁地创建和销毁线程会带来很大的开销。线程池是一种管理线程的机制，它可以重用线程，从而减少开销并提高响应速度。`java.util.concurrent.ExecutorService` 是 Java 中线程池的核心接口。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2'),
(9, NOW(), NOW(), 'C++11新特性概览', 5, '本文介绍了C++11标准中引入的一些重要新特性，如Lambda表达式、智能指针和范围for循环。', '<p>C++11 是对 C++98/03 标准的一次重大更新，引入了大量新特性，极大地提高了 C++ 的易用性和编程效率。 本文将概[[10](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQEwKJIapPWYI0YN3el3sG_ZUSF74mjDjSPV-jQ_uny8xV51pgKqqYr1OcxYZkDphztIJ5ukyMZPvjK7BJtRuxgBeO04QppSAwqenSp7FPQtn5uIhYH4s19rMBUCZhEwW0qephZWN_GoQPaV7nzaMQ%3D%3D)][[11](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQHzlDhmzpRdbG8Qv2j-yiNAKilnEy3ebSLy18FJBONL8om_aUvz9O5BkxTJkxB2lTe76gmIRmy9XepFkak5AFGpT9fGR8f_kAD5gMg0pj0QjtKIeBEyPDWVdU1roQ%3D%3D)]览其中一些重要的特性。</p><h3>语言核心特性</h3><ul><li><strong>`auto` 类型推导：</strong>允许编译器在编译时推导出变量的类型，简化了代码。</li><li><st[[12](https://www.google.com/url?sa=E&q=https%3A%2F%2Fvertexaisearch.cloud.google.com%2Fgrounding-api-redirect%2FAUZIYQH4-QMX6_lYhJ2XBucexwOFIFvYwHwbRxlOCJrjB4mc7ySTdAyU1S71uuRoPdAbKh-O58muio6jjsPiAtIT0hlB71_8U2lotaHuzpYROvPakmeS87nL06BLwPgH05LEoK-Nw2bNwdCaOoieDkyWuQ%3D%3D)]rong>范围 for 循环 (Range-based for loop)：</strong>提供了一种更简洁的方式来遍历容器中的元素。</li><li><strong>Lambda 表达式：</strong>允许在代码中定义匿名的函数对象，常用于 STL 算法。</li><li><strong>`nullptr`：</strong>引入了新的空指针类型，以区别于整数 `0`。</li><li><strong>初始化列表：</strong>提供了一种统一的方式来初始化聚合类型（如数组、结构体）。</li></ul><h3>智能指针</h3><p>C++11 在 `<memory>` 头文件中引入了智能指针，以帮助管理动态分配的内存，防止内存泄漏。</p><ul><li><strong>`std::unique_ptr`：</strong>独占所有权的智能指针，确保一个对象只有一个 `unique_ptr` 指向它。</li><li><strong>`std::shared_ptr`：</strong>共享所有权的智能指针，通过引用计数来管理对象的生命周期。</li><li><strong>`std::weak_ptr`：</strong>一种弱引用，它指向由 `shared_ptr`管理的对象，但不改变其引用计数。</li></ul><h3>并发支持</h3><p>C++11 在标准库中首次引入了对多线程编程的支持，包括 `std::thread`、`std::mutex`、`std::condition_variable` 等，为编写跨平台的并发程序提供了标准化的方式。</p>', 'http://t36rpmrye.hn-bkt.clouddn.com/FtjHVhzT3B290Z1iVpq5r-QkH1q2');

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