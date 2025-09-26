import axios from 'axios';
import type { AxiosPromise } from 'axios';
import { message } from 'antd';
import type {
  IApiResponse,
  IReqLogin,
  IReqRegister,
  IReqFindUser,
  IReqAddUser,
  IReqEditUser,
  IUser,
  IReqFindArticle,
  IReqAddArticle,
  IReqUpdateArticle,
  IRspArticleList,
  IRspFindArticle,
  IArticle,
  IRspComment,
  IReqAddComment,
  IComment,
  ICategory,
  IReqAddCategory,
  IProfile,
  IReqUpdateProfile,
} from '../utils/types';

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
        const customCode = data.status; // 对应 errmsg 中的 code
        const errorMessage = data.message; // 对应 errmsg 中的 message

        // 根据后端的自定义错误码进行精细化处理
        switch (customCode) {
            case 1004: // ERROR_TOKEN_NOT_EXIST
            case 1005: // ERROR_TOKEN_RUNTIEM
            case 1006: // ERROR_TOKEN_WRONG
            case 1007: // ERROR_TOKEN_TYPE_WRONG
                message.error(errorMessage || '登录状态已失效，请重新登录');
                sessionStorage.removeItem('token');
                // 延迟跳转，给用户看清提示的时间
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
                break;

            // --- 权限不足错误 ---
            case 1008: // ERROR_USER_NO_RIGHT
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

/**
 * 认证和公开路由
 */
export const authApi = {
    /** 用户登录 */
    login: (data: IReqLogin): AxiosPromise<IApiResponse<null>> => api.post('/login', data),
    /** 用户注册 */
    register: (data: IReqRegister): AxiosPromise<IApiResponse<null>> => api.post('/register', data),
    /** 邮件激活账户 (注意: 后端接收的查询参数是 'status'，代码中已做映射) */
    activateEmail: (params: { code: string }): AxiosPromise<IApiResponse<null>> => api.get('/active', { params: { status: params.code } }),
    /** 发送验证码邮件 */
    sendVerificationEmail: (params: { email: string }): AxiosPromise<IApiResponse<null>> => api.get('/sendmail', { params }),
    /** 使用邮箱验证码登录 (注意: 后端接收的查询参数是 'status'，代码中已做映射) */
    loginByEmail: (params: { email: string; code: string }): AxiosPromise<IApiResponse<null>> => api.get('/loginbyemail', { params: { email: params.email, status: params.code } }),
};

/**
 * 用户管理
 */
export const usersApi = {
    getUsers: (params: IReqFindUser): AxiosPromise<IApiResponse<IUser[]>> => api.post('/users', params),
    getUserInfo: (id: number): AxiosPromise<IApiResponse<IUser>> => api.get(`/user/${id}`),
    addUser: (data: IReqAddUser): AxiosPromise<IApiResponse<IUser>> => api.post('/user/add', data),
    updateUser: (data: IReqEditUser): AxiosPromise<IApiResponse<IUser>> => api.post('/user/update', data),
    deleteUser: (id: number): AxiosPromise<IApiResponse<null>> => api.delete(`/user/${id}`),
};

/**
 * 分类管理
 */
export const categoryApi = {
    getCategories: (): AxiosPromise<IApiResponse<ICategory[]>> => api.get('/category'),
    findCategoryById: (id: number): AxiosPromise<IApiResponse<ICategory>> => api.get(`/category/${id}`),
    addCategory: (data: IReqAddCategory): AxiosPromise<IApiResponse<ICategory>> => api.post('/category/add', data),
    editCategory: (id: number, data: { name: string }): AxiosPromise<IApiResponse<ICategory>> => api.post(`/category/${id}`, data),
    deleteCategory: (id: number): AxiosPromise<IApiResponse<null>> => api.delete(`/category/${id}`),
};

/**
 * 文章管理
 */
export const articlesApi = {
    getArticles: (params: IReqFindArticle): AxiosPromise<IApiResponse<IRspArticleList>> => api.post('/articles', params),
    getArticleDetail: (id: number): AxiosPromise<IApiResponse<IRspFindArticle>> => api.get(`/article/cate/${id}`),
    addArticle: (data: IReqAddArticle): AxiosPromise<IApiResponse<IArticle>> => api.post('/article/add', data),
    updateArticle: (id: number, data: IReqUpdateArticle): AxiosPromise<IApiResponse<IArticle>> => api.put(`/article/${id}`, data),
    deleteArticle: (id: number): AxiosPromise<IApiResponse<null>> => api.delete(`/article/${id}`),
};

/**
 * 评论管理
 */
export const commentsApi = {
    getComments: (articleId: number): AxiosPromise<IApiResponse<IRspComment[]>> => api.get(`/comment/${articleId}`),
    addComment: (data: IReqAddComment): AxiosPromise<IApiResponse<IComment>> => api.post('/comment', data),
    deleteComment: (id: number): AxiosPromise<IApiResponse<null>> => api.delete(`/comment/${id}`),
};


/**
 * 个人资料和文件上传
 */
export const profileApi = {
    getProfile: (): AxiosPromise<IApiResponse<IProfile>> => api.get('/profile'),
    updateProfile: (data: IReqUpdateProfile): AxiosPromise<IApiResponse<IProfile>> => api.put('/profile', data),
    
    // [新增] uploadFile 方法
    uploadFile: (file: File): AxiosPromise<IApiResponse<{ url: string }>> => {
        const formData = new FormData();
        // 关键：'file' 必须与后端 c.Request.FormFile("file") 中的 key 一致
        formData.append('file', file);
        return api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

export default api;