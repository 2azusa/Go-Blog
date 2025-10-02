import type { AxiosPromise } from 'axios';
import api from './index';
import type {
  IApiResponse,
  IReqLogin,
  IReqRegister,
  IReqLoginByEmail,
  IReqSendEmailForCode,
  IRspProfile,
  IReqProfile,
  IReqPagination,
  IRspCategory,
  IRspArticle,
  IReqComment,
  IRspComment,
  IRspUpload,
} from './types';

export const authApi = {
  login: (data: IReqLogin): AxiosPromise<IApiResponse<null>> => api.post('/login', data), // 用户名密码登陆
  register: (data: IReqRegister): AxiosPromise<IApiResponse<null>> => api.post('/register', data), // 用户注册
  loginByEmail: (data: IReqLoginByEmail): AxiosPromise<IApiResponse<null>> => api.post('/login/email', data), // 邮箱验证码登陆
  sendVerificationEmail: (data: IReqSendEmailForCode): AxiosPromise<IApiResponse<null>> => api.post('/email/code', data), // 发送验证码
};

export const profileApi = {
  getProfile: (): AxiosPromise<IApiResponse<IRspProfile>> => api.get('/profile'), // 获取个人资料
  updateProfile: (data: IReqProfile): AxiosPromise<null> => api.put('/profile', data), // 编辑个人资料
};

export const categoryApi = {
  getCategories: (params: IReqPagination): AxiosPromise<IApiResponse<IRspCategory[]>> => api.get('/categories', { params }), // 获取分类列表
  findCategoryById: (id: number): AxiosPromise<IApiResponse<IRspCategory>> => api.get(`/categories/${id}`), // 获取指定分类详情
  getArticlesByCategory: (id: number, params: IReqPagination): AxiosPromise<IApiResponse<IRspArticle[]>> =>api.get(`/categories/${id}/articles`, { params }), // 获取某分类下所有文章
};

export const articlesApi = {
  getArticles: (params: IReqPagination): AxiosPromise<IApiResponse<IRspArticle[]>> => api.get('/articles', { params }), // 获取文章列表
  getArticleDetail: (id: number): AxiosPromise<IApiResponse<IRspArticle>> => api.get(`/articles/${id}`), // 获取指定文章详情
};

export const commentsApi = {
  getComments: (articleId: number): AxiosPromise<IApiResponse<IRspComment[]>> => api.get(`/articles/${articleId}/comments`), // 查看指定文章下的评论
  addComment: (data: IReqComment): AxiosPromise<IApiResponse<null>> => api.post('/comments', data), // 添加评论
  deleteComment: (id: number): AxiosPromise<IApiResponse<null>> => api.delete(`/comments/${id}`), // 删除评论
};

export const uploadApi = {
  uploadImage: (data: FormData): AxiosPromise<IApiResponse<IRspUpload>> =>
    api.post('/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};