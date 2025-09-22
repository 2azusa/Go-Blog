import { createBrowserRouter, Navigate } from 'react-router-dom';

// // 导入我们的布局组件和保护路由组件
import HomeLayout from '../layout/HomeLayout';
import ProtectedRoute from './ProtectedRoute';

// 使用 createBrowserRouter 创建路由实例
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/home',
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
    // 当用户访问根路径'/'时，自动重定向到 /home
    // ProtectedRoute 会处理后续的登录验证
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  }
]);

