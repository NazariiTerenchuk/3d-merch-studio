import { apiClient, type UploadProgressHandler } from '@/lib/api-client';
import type { CreateMerchItem, MerchItem, MerchItemSummary, UpdateMerchItem } from '@/types';

const BASE_URL = '/merch-items';

export interface MerchItemsFilter {
  category?: string;
  onlyActive?: boolean;
}

export const merchItemsApi = {
  getCategories: async () => {
    const response = await apiClient.get<string[]>(`${BASE_URL}/categories`);
    return response.data;
  },

  getAll: async ({ category, onlyActive = true }: MerchItemsFilter = {}) => {
    const response = await apiClient.get<MerchItemSummary[]>(`${BASE_URL}/get-all`, {
      category: category || undefined,
      onlyActive,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<MerchItem>(`${BASE_URL}/get-by-id/${id}`);
    return response.data;
  },

  create: async (data: CreateMerchItem) => {
    const response = await apiClient.post<MerchItem>(`${BASE_URL}/create`, data);
    return response.data;
  },

  update: async (id: string, data: UpdateMerchItem) => {
    const response = await apiClient.put<MerchItem>(`${BASE_URL}/update/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<MerchItem>(`${BASE_URL}/delete/${id}`);
    return response.data;
  },

  uploadModel: async (id: string, file: File, onProgress?: UploadProgressHandler) => {
    const formData = new FormData();
    formData.append('modelFile', file);
    const response = await apiClient.putFormData<MerchItem>(`${BASE_URL}/upload-model/${id}`, formData, onProgress);
    return response.data;
  },

  uploadPreview: async (id: string, file: File, onProgress?: UploadProgressHandler) => {
    const formData = new FormData();
    formData.append('previewFile', file);
    const response = await apiClient.putFormData<MerchItem>(`${BASE_URL}/upload-preview/${id}`, formData, onProgress);
    return response.data;
  },
};
