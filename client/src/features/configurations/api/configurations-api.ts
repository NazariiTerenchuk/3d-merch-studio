import { apiClient } from '@/lib/api-client';
import type { CreateSavedConfiguration, SavedConfiguration, UpdateSavedConfiguration } from '@/types';

const BASE_URL = '/configurations';

export const configurationsApi = {
  getAll: async () => {
    const response = await apiClient.get<SavedConfiguration[]>(`${BASE_URL}/get-all`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<SavedConfiguration>(`${BASE_URL}/get-by-id/${id}`);
    return response.data;
  },

  getByShareCode: async (shareCode: string) => {
    const response = await apiClient.get<SavedConfiguration>(`${BASE_URL}/by-share-code/${shareCode}`);
    return response.data;
  },

  create: async (data: CreateSavedConfiguration) => {
    const response = await apiClient.post<SavedConfiguration>(`${BASE_URL}/create`, data);
    return response.data;
  },

  update: async (id: string, data: UpdateSavedConfiguration) => {
    const response = await apiClient.put<SavedConfiguration>(`${BASE_URL}/update/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<SavedConfiguration>(`${BASE_URL}/delete/${id}`);
    return response.data;
  },
};
