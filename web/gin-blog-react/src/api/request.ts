import axios from 'axios';
import { message } from 'antd'; // 用于显示消息提示

const request = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // 从原 http.js 获取的基础 URL
  withCredentials: true, // 从原 http.js 获取
  timeout: 10000, // 可选：请求超时时间
});

// 请求拦截器：在发送请求前添加认证 token
request.interceptors.request.use(
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

// 响应拦截器：处理响应数据和错误
request.interceptors.response.use(
  (response) => {
    // 您可以在这里添加通用的成功响应处理逻辑
    // 例如，如果您的后端总是返回 { code, message, data } 这样的结构
    // if (response.data.code !== 200) {
    //   message.error(response.data.message || '请求失败');
    //   return Promise.reject(response.data);
    // }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401: // 未授权：token 无效或过期
          message.error(data.message || '登录状态已过期，请重新登录');
          sessionStorage.removeItem('token'); // 清除无效 token
          // 重定向到登录页。在非组件文件中，使用 window.location.href 是一个简单的方法。
          // 在更复杂的应用中，可能会使用全局 history 对象或 Redux action 来触发导航。
          window.location.href = '/';
          break;
        case 403: // 禁止访问
          message.error(data.message || '您没有权限访问此资源');
          break;
        case 404: // 资源未找到
          message.error(data.message || '请求的资源不存在');
          break;
        case 500: // 服务器内部错误
          message.error(data.message || '服务器内部错误，请稍后再试');
          break;
        default:
          message.error(data.message || `请求错误: ${status}`);
      }
    } else if (error.request) {
      // 请求已发出但未收到响应
      message.error('网络错误，请检查您的网络连接');
    } else {
      // 在设置请求时发生了一些错误
      message.error('请求失败: ' + error.message);
    }
    return Promise.reject(error);
  }
);

export default request;
