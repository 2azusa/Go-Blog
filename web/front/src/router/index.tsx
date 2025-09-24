import { createBrowserRouter } from 'react-router-dom';

// // 导入我们的布局组件和保护路由组件
import HomeLayout from '../layout/HomeLayout';
import ProtectedRoute from './ProtectedRoute';
import NotFoundPage from '../pages/NotFoundPage';

import LoginPage from '../pages/LoginPage';
import ArticleDetailPage from '../pages/ArticleDetailPage';
import ArticleListPage from '../pages/ArticleListPage';

// 使用 createBrowserRouter 创建路由实例
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    // 关键：用 ProtectedRoute 包裹布局组件，保护所有子路由
    element: (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    // 子路由配置，完全对应您的项目页面
    children: [
      {
        path: '', 
        element: <ArticleListPage />,
      },
      {
        path: 'detail/:id',
        element: <ArticleDetailPage />,
      },
      {
        path:":id",
        element: <ArticleListPage />,
      },
    ],
  },
  {
    // 404 Not Found 路由
    // 重定向到首页是一种策略，但显示一个404页面通常是更好的用户体验
    path: '*',
    element: <NotFoundPage />,
  }
]);


/**
  核心内容展示 (无需登录)
  GET /api/v1/category: 获取所有分类列表，用于在导航栏或侧边栏展示。
  GET /api/v1/category/:id: 查询某个分类的详细信息。
  GET /api/v1/articles: 获取所有已发布的文章列表（注意：后端逻辑需要处理，只返回已发布的文章）。
  GET /api/v1/article/cate/:id: 获取某个分类下的所有文章。
  GET /api/v1/user/:id: 查看某个作者的公开信息（比如昵称、发表的文章列表）。
  GET /api/v1/comment/:id: 查看某篇文章下的所有评论。
  用户交互 (可能需要登录)
  POST /api/v1/login: 普通用户登录。
  POST /api/v1/register: 用户注册。
  GET /api/v1/active: 邮件激活账户。
  GET /api/v1/sendmail: 发送登录/验证邮件。
  GET /api/v1/loginbyemail: 使用邮箱验证码登录。
  GET /api/v1/profile: 获取当前登录用户的个人信息。
  PUT /api/v1/profile: 允许登录用户更新自己的个人设置。
  POST /api/v1/comment: 登录用户发表评论。
 */