export interface ApiResponse<T> {
  status: number;
  message?: string;
  data: T;
  url?: string;
}

export interface ApiUploadResponse {
  status: number;
  message?: string;
  url: string;
}