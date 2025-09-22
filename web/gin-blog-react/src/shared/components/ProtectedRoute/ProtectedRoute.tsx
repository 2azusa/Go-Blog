import React, { type JSX } from 'react';
// 修正了拼写错误
import { Navigate, useLocation } from 'react-router-dom';

/**
 * 定义组件接收的 props 类型。
 * 'children' 是一个特殊的 prop，代表了被这个组件包裹的任何 React 元素。
 */
interface ProtectedRouteProps {
  children: JSX.Element;
}

/**
 * 保护路由组件 (ProtectedRoute)
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = sessionStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // 如果用户未登录，重定向到登录页
    // 并通过 state 保存用户原本想访问的页面路径
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果用户已登录，则直接渲染子组件
  return children;
};

export default ProtectedRoute;