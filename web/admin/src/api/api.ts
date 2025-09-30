import axios from 'axios';
import type { AxiosPromise } from 'axios';
import { message } from 'antd';
import type {
  IApiResponse, IRspUser, IRspProfile, IRspArticle, IRspCategory, IRspComment, IRspUpload,
  IReqUser, IReqCategory, IReqArticle, IReqProfile, IReqComment, IReqPagination,
  IReqLogin, IReqRegister,/*IReqActiveEmail,*/ IReqLoginByEmail, IReqSendEmailForCode,
} from '../types/types';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            message.error('网络错误，请检查您的网络连接或确认后端服务是否已启动');
            return Promise.reject(error);
        }

        const { data } = error.response;
        const customCode = data.status;
        const errorMessage = data.message;

        switch (customCode) {
            case 1004:
            case 1005:
            case 1006:
            case 1007:
                message.error(errorMessage || '登录状态已失效，请重新登录');
                sessionStorage.removeItem('token');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
                break;
            case 1008:
                message.error(errorMessage || '对不起，您没有该操作权限');
                break;
            default:
                if (errorMessage) {
                    message.error(errorMessage);
                } else {
                    const httpStatus = error.response.status;
                    switch(httpStatus) {
                        case 404: message.error('请求错误，未找到该资源'); break;
                        case 500: message.error('服务器错误，请稍后重试'); break;
                        default: message.error(`请求失败：${error.message}`);
                    }
                }
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    login: (data: IReqLogin): AxiosPromise<IApiResponse<null>> => api.post('/login', data), // 用户名密码登陆
    register: (data: IReqRegister): AxiosPromise<IApiResponse<null>> => api.post('/register', data), // 用户注册
    loginByEmail: (data: IReqLoginByEmail): AxiosPromise<IApiResponse<null>> => api.post('/login/email', data), // 邮箱验证码登陆
    sendVerificationEmail: (data: IReqSendEmailForCode): AxiosPromise<IApiResponse<null>> => api.post('/email/code', data), // 发送验证码
    // activateEmail: (params: IReqActiveEmail): AxiosPromise<IApiResponse<null>> => api.get('/active', { params }), // 邮箱激活链接
};

export const usersApi = {
    getUsers: (params: IReqPagination): AxiosPromise<IApiResponse<IRspUser[]>> => api.get('/users', { params }), // 获取用户列表
    getUserInfo: (id: number): AxiosPromise<IApiResponse<IRspUser>> => api.get(`/users/${id}`), // 获取指定用户详情
    addUser: (data: IReqUser): AxiosPromise<IApiResponse<null>> => api.post('/users/add', data), // 添加用户
    updateUser: (id: number, data: IReqUser): AxiosPromise<IApiResponse<null>> => api.put(`/users/${id}`, data), // 编辑用户
    deleteUser: (id: number): AxiosPromise<IApiResponse<null>> => api.delete(`/users/${id}`), // 删除用户
};

export const profileApi = {
    getProfile: (): AxiosPromise<IApiResponse<IRspProfile>> => api.get('/profile'), // 获取个人资料
    updateProfile: (data: IReqProfile): AxiosPromise<null> => api.put('/profile', data), // 编辑个人资料
};

export const categoryApi = {
    getCategories: (params: IReqPagination): AxiosPromise<IApiResponse<IRspCategory[]>> => api.get('/categories', { params }), // 获取分类列表
    findCategoryById: (id: number): AxiosPromise<IApiResponse<IRspCategory>> => api.get(`/categories/${id}`), // 获取指定分类详情
    getArticlesByCategory: (id: number, params: IReqPagination ): AxiosPromise<IApiResponse<IRspArticle[]>> => api.get(`/categories/${id}/articles`, { params }), // 获取某分类下所有文章

    addCategory: (data: IReqCategory): AxiosPromise<IApiResponse<null>> => api.post('/categories', data), // 添加分类
    editCategory: (id: number, data: IReqCategory): AxiosPromise<IApiResponse<null>> => api.put(`/categories/${id}`, data), // 编辑分类
    deleteCategory: (id: number): AxiosPromise<IApiResponse<null>> => api.delete(`/categories/${id}`), // 删除分类
};

export const articlesApi = {
    getArticles: (params: IReqPagination): AxiosPromise<IApiResponse<IRspArticle[]>> => api.get('/articles', { params }), // 获取文章列表
    getArticleDetail: (id: number): AxiosPromise<IApiResponse<IRspArticle>> => api.get(`/articles/${id}`), // 获取指定文章详情

    addArticle: (data: IReqArticle): AxiosPromise<IApiResponse<null>> => api.post('/articles', data), // 添加文章
    updateArticle: (id: number, data: IReqArticle): AxiosPromise<IApiResponse<null>> => api.put(`/articles/${id}`, data), // 编辑文章
    deleteArticle: (id: number): AxiosPromise<IApiResponse<null>> => api.delete(`/articles/${id}`), // 删除文章
};

export const commentsApi = {
    getComments: (articleId: number): AxiosPromise<IApiResponse<IRspComment[]>> => api.get(`/articles/${articleId}/comments`), // 查看指定文章下的评论

    addComment: (data: IReqComment): AxiosPromise<IApiResponse<null>> => api.post('/comments', data), // 添加评论
    deleteComment: (id: number): AxiosPromise<IApiResponse<null>> => api.delete(`/comments/${id}`), // 删除评论
};

export const uploadApi = {
    // 上传文件
    uploadFile: (file: File): AxiosPromise<IApiResponse<IRspUpload>> => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    uploadImage: (data: FormData): AxiosPromise<IApiResponse<{ url: string }>> => 
    api.post('/upload', data, {
        // 必须设置正确的 Content-Type，让后端知道这是一个文件上传请求
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};
