import { createBrowserRouter } from 'react-router-dom';

import LoginPage from '../pages/Auth/LoginPage.tsx'
import AdminLayout from '../components/AdminLayout.tsx'
import ProtectedRoute from './ProtectedRoute.tsx';

import IndexPage from '../pages/IndexPage.tsx';
// import AddArtPage from '../pages/AddArtPage.tsx';
import ArticleListPage from '../pages/Article/ArticleListPage.tsx';
import CateListPage from '../pages/Category/CateListPage.tsx';
import CateDetailPage from '../pages/Category/CateDetailPage.tsx';
// import ProfilePage from '../pages/ProfilePage.tsx';
import UserListPage from '../pages/User/UserListPage.tsx';
import NotFoundPage from '../pages/NotFoundPage.tsx';
import UserDetailPage from '../pages/User/UserDetailPage.tsx';
import RegisterPage from '../pages/Auth/RegisterPage.tsx';

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
      // {
      //   path: 'addart/:id?',
      //   element: <AddArtPage />,
      // },
      {
        path: 'articlelist',
        element: <ArticleListPage />,
      },
      // {
      //   path: 'articledetail/:id?',
      //   element: <ArticleDetailPage />
      // },
      {
        path: 'catelist',
        element: <CateListPage />,
      },
      {
        path: 'catedetail/:id?',
        element: <CateDetailPage />
      },
      {
        path: 'userlist',
        element: <UserListPage />,
      },
      {
        path: 'userdetail/:id?',
        element: <UserDetailPage />
      },
      // {
      //   path: 'profile',
      //   element: <ProfilePage />,
      // },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  }
]);