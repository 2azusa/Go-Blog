import axios from 'axios';
import { message } from 'antd';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
    timeout: 10000,
});

// 请求拦截器，在发送请求前添加认证 token
api.interceptors.response.use(
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

// 响应拦截器，处理响应数据和错误
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            switch(status) {
                case 401:
                    message.error(data.message || '登陆状态已过期，请重新登陆');
                    sessionStorage.removeItem('token');
                    window.location.href = '/';
                    break;
                case 403:
                    message.error(data.message || '无权访问');
                    break;
                case 404:
                    message.error(data.message || '请求错误，未找到该资源');
                    break;
                case 500:
                    message.error(data.message || '服务器错误');
                    break;
                default:
                    message.error(data.message || `请求错误：${status}`);
            }
        } else if (error.request) {
            message.error('网络错误，请检查您的网络连接');
        } else {
            message.error('请求失败：' + error.message);
        }
        return Promise.reject(error);
    }
);

export default api;