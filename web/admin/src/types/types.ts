// ========== 修正并统一后的所有类型定义 ==========

export interface IApiResponse<T> {
  data: T;
  message: string;
  status: number;
  total?: number;
  token?: string;
}

export interface IReqPagination {
  pagesize: number;
  pagenum: number;
  query?: string;
  title?: string;
}

// --- authApi ---
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
  email: string; // PascalCase -> camelCase
  code: string;  // PascalCase -> camelCase
}
export interface IReqSendEmailForCode {
  code: string;
}

// --- usersApi ---
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

// --- categoryApi ---
export interface IReqCategory {
  name: string;
}
export interface IRspCategory {
  id: number;
  name: string;
}

// --- articlesApi ---
export interface IReqArticle {
  title: string;
  cid: number;
  desc: string;
  content: string;
  img: string;
}
export interface IRspArticle {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  desc: string;
  content: string;
  img: string;
  cid: number;
  category: IRspCategory;
  comments: IRspComment[];
}

// --- commentsApi ---
export interface IReqComment {
  articleId: number; // snake_case -> camelCase
  content: string;
}
export interface IRspComment {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  commentator: string;
  content: string;
  articleId: number; // snake_case -> camelCase
  parentId: number;  // snake_case -> camelCase
}

// --- profileApi ---
export interface IReqProfile {
  name: string;
  desc: string;
  qqchat: string;
  wechat: string;
  weibo: string;
  email: string;
  img: string;
  avatar: string;
}
export interface IRspProfile {
  userId: number;
  name: string;
  desc: string;
  qqchat: string;
  wechat: string;
  weibo: string;
  email: string;
  img: string;
  avatar: string;
}

// ---通用---
export interface IRspUpload {
  url: string;
}