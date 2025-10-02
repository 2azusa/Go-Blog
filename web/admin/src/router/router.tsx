import { createBrowserRouter } from 'react-router-dom';

import IndexPage from '../pages/IndexPage.tsx';
import NotFoundPage from '../pages/NotFoundPage.tsx';
import LoginPage from '../pages/Auth/LoginPage.tsx';
import RegisterPage from '../pages/Auth/RegisterPage.tsx';
import AdminLayout from '../components/layout/AdminLayout.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';

import ArticleListPage from '../pages/Article/ArticleListPage.tsx';
import EditArticlePage from '../pages/Article/EditArticlePage.tsx';
import ArticleDetailPage from '../pages/Article/ArticleDetailPage.tsx';
import CategoryListPage from '../pages/Category/CategoryListPage.tsx';
import CategoryDetailPage from '../pages/Category/CategoryDetailPage.tsx';
import UserListPage from '../pages/User/UserListPage.tsx';
import UserDetailPage from '../pages/User/UserDetailPage.tsx';
import ProfilePage from '../pages/User/ProfilePage.tsx';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
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
        path: 'articlelist',
        element: <ArticleListPage />,
      },
      {
        path: 'article/add',
        element: <EditArticlePage />,
      },
      {
        path: 'article/edit/:id',
        element: <EditArticlePage />,
      },
      {
        path: 'articledetail/:id?',
        element: <ArticleDetailPage />
      },
      {
        path: 'categorylist',
        element: <CategoryListPage />,
      },
      {
        path: 'categorydetail/:id?',
        element: <CategoryDetailPage />
      },
      {
        path: 'userlist',
        element: <UserListPage />,
      },
      {
        path: 'userdetail/:id?',
        element: <UserDetailPage />
      },
      {
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