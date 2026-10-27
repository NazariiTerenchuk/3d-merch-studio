import { apiClient, type UploadProgressHandler } from '@/lib/api-client';
import type { CreatePrint, Print, UpdatePrint } from '@/types';

const BASE_URL = '/prints';

export interface PrintsFilter {
  category?: string;
  onlyActive?: boolean;
}

export const printsApi = {
  getCategories: async () => {
    const response = await apiClient.get<string[]>(`${BASE_URL}/categories`);
    return response.data;
  },

  getAll: async ({ category, onlyActive = true }: PrintsFilter = {}) => {
    const response = await apiClient.get<Print[]>(`${BASE_URL}/get-all`, {
      category: category || undefined,
      onlyActive,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Print>(`${BASE_URL}/get-by-id/${id}`);
    return response.data;
  },

  create: async (data: CreatePrint) => {
    const response = await apiClient.post<Print>(`${BASE_URL}/create`, data);
    return response.data;
  },

  update: async (id: string, data: UpdatePrint) => {
    const response = await apiClient.put<Print>(`${BASE_URL}/update/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<Print>(`${BASE_URL}/delete/${id}`);
    return response.data;
  },

  uploadImage: async (id: string, file: File, onProgress?: UploadProgressHandler) => {
    const formData = new FormData();
    formData.append('imageFile', file);
    const response = await apiClient.putFormData<Print>(`${BASE_URL}/upload-image/${id}`, formData, onProgress);
    return response.data;
  },
};
