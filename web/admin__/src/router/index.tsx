import { createBrowserRouter } from 'react-router-dom';

import LoginPage from '../pages/LoginPage.tsx'
import AdminLayout from '../pages/AdminLayout.tsx'
import ProtectedRoute from './ProtectedRoute.tsx';

import AddArtPage from '../pages/admin/AddArtPage.tsx';
import ArtListPage from '../pages/admin/ArtListPage.tsx';
import IndexPage from '../pages/admin/IndexPage.tsx';
import CateListPage from '../pages/admin/CateListPage.tsx';
import ProfilePage from '../pages/admin/ProfilePage.tsx';
import UserListPage from '../pages/admin/UserListPage.tsx';
import NotFoundPage from '../pages/NotFoundPage.tsx';


// index        IndexPage
// addart       AddArtPage
// addart/:id   AddArtPage
// artlist      ArtListPage
// catelist     CateListPgae
// userlist     UserListPage
// profile      ProfilePage

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: 'addart/:id?',
        element: <AddArtPage />,
      },
      {
        path: 'artlist',
        element: <ArtListPage />,
      },
      {
        path: 'catelist',
        element: <CateListPage />,
      },
      {
        path: 'userlist',
        element: <UserListPage />,
      },{
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  }
]);

/**
  用户管理
  GET /api/v1/users: 查询所有用户列表，用于管理。
  POST /api/v1/user/update: 编辑某个用户的信息。
  DELETE /api/v1/user/:id: 删除指定用户。
  POST /api/v1/user/add: (虽然在 route 组，但添加用户通常是管理员行为) 添加新用户。
  分类管理
  GET /api/v1/category: 获取所有分类列表，用于管理界面展示。
  POST /api/v1/category/add: 添加新分类。
  POST /api/v1/category/add: 编辑分类信息 (你的代码里编辑和添加用了同一个URL，建议修改为 PUT /api/v1/category/:id)。
  DELETE /api/v1/category/:id: 删除分类。
  文章管理
  GET /api/v1/articles: 获取所有文章列表（无论发布与否），用于管理。
  POST /api/v1/article/add: 添加新文章。
  PUT /api/v1/article/:id: 编辑（更新）指定文章。
  DELETE /api/v1/article/:id: 删除指定文章。
  评论管理
  GET /api/v1/comment/:id: 获取某篇文章下的所有评论，用于审核或管理。
  DELETE /api/v1/comment/:id: 删除指定评论。
  系统与其他功能
  POST /api/v1/upload: 上传文件（例如文章的封面图、插图等）。
  PUT /api/v1/profile: 更新个人资料（管理员自己的资料）。
  POST /api/v1/login: 管理员登录接口。
 */