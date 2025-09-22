import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 导入所有页面级组件
import LoginPage from './pages/LoginPage';
import AdminLayout from './shared/layouts/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import AddArticlePage from './pages/AddArticlePage';
import ArticleListPage from './pages/ArticleListPage';
import CategoryListPage from './pages/CategoryListPage';
import UserListPage from './pages/UserListPage';
import ProfilePage from './pages/ProfilePage';

// 导入我们的保护路由组件
import ProtectedRoute from './shared/components/ProtectedRoute/ProtectedRoute';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公共路由：登录页 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 受保护的后台管理路由 */}
        {/* 所有 /admin 下的路径都需要先通过 ProtectedRoute 的验证 */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* index 路由定义了父路由 /admin 的默认显示内容 */}
          <Route index element={<DashboardPage />} />
          
          {/* 注意：子路由的 path 都是相对父路由的，不带斜杠 */}
          <Route path="artlist" element={<ArticleListPage />} />
          <Route path="addart" element={<AddArticlePage />} />
          <Route path="addart/:id" element={<AddArticlePage />} />
          <Route path="catelist" element={<CategoryListPage />} />
          <Route path="userlist" element={<UserListPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* 根路径重定向 */}
        {/* 当用户访问根路径'/'时，自动跳转到登录页或后台首页 */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* 404 Not Found 页面 */}
        <Route path="*" element={<h3>404 - Page Not Found</h3>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;