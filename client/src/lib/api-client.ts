import axios, { type AxiosInstance, type AxiosProgressEvent } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5132';

export type UploadProgressHandler = (percent: number) => void;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  get<T>(url: string, params?: Record<string, unknown>) {
    return this.client.get<T>(url, { params });
  }

  post<T>(url: string, data?: unknown) {
    return this.client.post<T>(url, data);
  }

  put<T>(url: string, data?: unknown) {
    return this.client.put<T>(url, data);
  }

  delete<T>(url: string) {
    return this.client.delete<T>(url);
  }

  putFormData<T>(url: string, formData: FormData, onProgress?: UploadProgressHandler) {
    return this.client.put<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // .glb models can be large, so uploads get a longer timeout than regular requests
      timeout: 5 * 60 * 1000,
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });
  }
}

export const apiClient = new ApiClient();
