export interface IApiResponse<T> {
  data: T;
  message: string;
  status: number;
  total?: number;
  token?: string;
}

export interface IReqPagination {
  pageSize: number;
  pageNum: number;
  Query?: string; // users
  title?: string // article
}

// authApi
export interface IReqLogin {
  username: string;
  password: string;
}
export interface IReqRegister {
  username: string;
  password: string;
  email: string;
}
export interface IReqActiveEmail {
  code: string;
}

export interface IReqLoginByEmail {
    Email: string,
    Code: string,
}

export interface IReqSendEmailForCode {
  code: string;
}

// usersApi
export interface IReqUser {
  username: string;
  password?: string;
  email: string;
  role: number;
}

export interface IRspUser {
  id: number;
  createdAt: string;
  username: string;
  email: string;
  role: number;
}

// categoryApi
export interface IReqCategory {
  name: string;
}

export interface IRspCategory {
  id: number;
  name: string;
}

// articlesApi
export interface IReqArticle {
  title: string;
  cid: number;
  desc: string;
  content: string;
  img: string;
}

export interface IRspArticle {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  title: string;
  cid: number; // 分类 id
  desc: string;
  content: string;
  img: string;
  category: IRspCategory;
  comments: IRspComment[];
}

// commentsApi
export interface IReqComment {
  article_id: number;
  content: string;
}

export interface IRspComment {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  commentator: string;
  content: string;
  article_id: number;
  parent_id: number; 
}

// profileApi
export interface IReqProfile {
  name: string;
  desc: string;
  qq_chat: string;
  wechat: string;
  weibo: string;
  email: string;
  img: string;
  avatar: string;
}

export interface IRspProfile {
  user_id: number;
  name: string;
  desc: string;
  qq_chat: string;
  wechat: string;
  weibo: string;
  email: string;
  img: string;
  avatar: string;
}

export interface IRspUpload {
  url: string;
}