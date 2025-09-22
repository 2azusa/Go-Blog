import { createBrowserRouter, Navigate } from 'react-router-dom';

// 导入我们的布局组件和保护路由组件
import AdminLayout from '../shared/layouts/AdminLayout';
import ProtectedRoute from '../shared/components/ProtectedRoute/ProtectedRoute'; // 确保路径正确

// 导入所有的“页面”组件
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ArticleListPage from '../pages/ArticleListPage';
import AddArticlePage from '../pages/AddArticlePage';
import CategoryListPage from '../pages/CategoryListPage';
import UserListPage from '../pages/UserListPage';
import ProfilePage from '../pages/ProfilePage';

// 使用 createBrowserRouter 创建路由实例
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    // 关键：用 ProtectedRoute 包裹布局组件，保护所有子路由
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    // 子路由配置，完全对应您的项目页面
    children: [
      {
        // 'index: true' 表示当 URL 为父路径(/admin)时，默认渲染此组件
        index: true, 
        element: <DashboardPage />,
      },
      {
        path: 'artlist', // 相对路径，完整路径为 /admin/artlist
        element: <ArticleListPage />,
      },
      {
        path: 'addart', // 新增文章的路径
        element: <AddArticlePage />,
      },
      {
        // 编辑文章的路径，带 ID 参数
        path: 'addart/:id', 
        element: <AddArticlePage />,
      },
      {
        path: 'catelist',
        element: <CategoryListPage />,
      },
      {
        path: 'userlist',
        element: <UserListPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    // 当用户访问根路径'/'时，自动重定向到 /admin
    // ProtectedRoute 会处理后续的登录验证
    path: '/',
    element: <Navigate to="/admin" replace />,
  },
  {
    // 404 Not Found 页面
    path: '*',
    element: <h3>404 - 页面未找到</h3>,
  }
]);

