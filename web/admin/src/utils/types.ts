/**
 * @fileoverview Defines the application's all TypeScript data structures.
 * This file centralizes all type definitions that correspond to the backend Go structs.
 */

// ===================================================================================
// I. General & Base Interfaces
// ===================================================================================

/**
 * The common outer structure for API responses.
 * @template T The specific type of the `data` field.
 */
export interface IApiResponse<T> {
  data: T;
  message: string;
  status: number;
  total?: number;
  token?: string;
}

export interface IGormModel {
  ID: number;
  CreatedAt: string;
  UpdatedAt:string;
  DeletedAt: string | null;
}


// ===================================================================================
// II. Core Model Interfaces
// Corresponds to the Go `model` layer for internal data representation.
// ===================================================================================

export interface IProfile {
  id: number;
  name: string;
  desc: string;
  qq_chat: string;
  wechat: string;
  weibo: string;
  email: string;
  img: string;
  avatar: string;
}

export interface IUser extends IGormModel {
  username: string;
  email: string;
  role: number;
  articles: IArticle[];
  status: string;
}

export interface IComment extends IGormModel {
  commentator: string;
  content: string;
  article_id: number;
  parent_id: number | null;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface IArticle extends IGormModel {
  title: string;
  cid: number;
  desc: string;
  content: string;
  img: string;
  category: ICategory;
  comments: IComment[];
}


// ===================================================================================
// III. Data Transfer Object (DTO) Interfaces
// Corresponds to the Go `dto` layer for API communication.
// ===================================================================================

// ? // --- Auth DTOs ---
export interface IReqLogin {
  username: string;
  password: string;
}

export interface IReqRegister {
  username: string;
  password: string;
  email: string;
}

// --- User DTOs ---

export interface IReqFindUser {
  pagenum: number;
  pagesize: number;
  idorname: string;
}

export interface IReqAddUser {
  username: string;
  password: string;
  email: string;
  role: number;
}

export interface IReqEditUser {
  id: number;
  username: string;
  email: string;
  role: number;
}

// --- Category DTOs ---

export interface IReqFindCate {
  pagenum: number;
  pagesize: number;
}

export interface IReqAddCategory {
  name: string;
}

export interface IReqEditCategory {
  name: string;
}

// --- Article DTOs ---

export interface IReqFindArticle {
  pagenum: number;
  pagesize: number;
  title: string;
}

// ?
export interface IReqCateArticle {
  pagenum: number;
  pagesize: number;
  id: number;
}

export interface IReqAddArticle {
  title: string;
  cid: number;
  desc: string;
  content: string;
  img: string;
}

export interface IReqUpdateArticle extends IReqAddArticle {
  id: number;
}

/** A flattened article structure for list views, corresponds to `RspFindArticle`. */
export interface IRspFindArticle {
  id: number;
  title: string;
  name: string; // Category name
  CreatedAt: string;
  desc: string;
  content: string;
  img: string;
}

export interface IRspArticleList {
  articles: IRspFindArticle[];
  total: number;
}

// --- Comment DTOs ---

export interface IReqAddComment {
  article_id: number;
  content: string;
}

export interface IRspComment extends IGormModel {
  content: string;
  article_id: number;
  parent_id: number | null;
  commentator: string;
}

// --- Profile DTOs ---

export interface IReqUpdateProfile {
  name: string;
  desc: string;
  qq_chat: string;
  wechat: string;
  weibo: string;
  email: string;
  img: string;
  avatar: string;
}