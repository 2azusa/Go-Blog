export interface Article {
  id: number;
  name: string; // Category name
  title: string;
  desc: string;
  img: string;
}

export interface ArticleInfo {
  id?: number;
  title: string;
  cid?: number;
  desc: string;
  content: string;
  img: string;
}
