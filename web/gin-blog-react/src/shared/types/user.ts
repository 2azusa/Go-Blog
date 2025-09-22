export interface User {
  ID: number;
  username: string;
  role: number;
  email: string;
  password?: string;
  checkpass?: string;
}

export interface ProfileInfo {
  id?: number;
  name: string;
  desc: string;
  qq_chat: string;
  wechat: string;
  weibo: string;
  email: string;
  img: string;
  avatar: string;
}
