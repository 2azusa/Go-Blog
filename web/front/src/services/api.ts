import axios from 'axios';
import { notificationService } from './context/NotificationContext';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  // withCredentials: true, 
  timeout: 10000,
});

// 请求拦截器：在发送请求前添加认证 token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：使用 notificationService 替换 antd message
api.interceptors.response.use(
  (response) => {
    // 直接返回响应体，让业务代码更简洁
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.message || '请求失败'; // 从后端获取错误信息
      switch (status) {
        case 401:
          notificationService.show('登录状态已过期，请重新登录', 'error');
          sessionStorage.removeItem('token');
          window.location.href = '/login'; // 重定向到登录页
          break;
        case 403:
          notificationService.show(data?.message || '您没有权限访问此资源', 'warning');
          break;
        case 404:
          notificationService.show(errorMessage, 'error');
          break;
        case 500:
          notificationService.show(data?.message || '服务器内部错误，请稍后再试', 'error');
          break;
        default:
          notificationService.show(`${errorMessage} (状态码: ${status})`, 'error');
      }
    } else if (error.request) {
      notificationService.show('网络错误，请检查您的网络连接', 'error');
    } else {
      notificationService.show('请求失败: ' + error.message, 'error');
    }
    return Promise.reject(error);
  }
);

export default api;
