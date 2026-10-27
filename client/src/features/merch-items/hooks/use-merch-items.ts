import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UploadProgressHandler } from '@/lib/api-client';
import type { UpdateMerchItem } from '@/types';
import { merchItemsApi, type MerchItemsFilter } from '../api/merch-items-api';

export const MERCH_ITEMS_QUERY_KEY = 'merch-items';

export function useMerchCategories() {
  return useQuery({
    queryKey: [MERCH_ITEMS_QUERY_KEY, 'categories'],
    queryFn: merchItemsApi.getCategories,
    staleTime: Infinity,
  });
}

export function useMerchItems(filter: MerchItemsFilter = {}) {
  return useQuery({
    queryKey: [MERCH_ITEMS_QUERY_KEY, 'list', filter],
    queryFn: () => merchItemsApi.getAll(filter),
  });
}

export function useMerchItem(id: string | undefined) {
  return useQuery({
    queryKey: [MERCH_ITEMS_QUERY_KEY, id],
    queryFn: () => merchItemsApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateMerchItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: merchItemsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [MERCH_ITEMS_QUERY_KEY] }),
  });
}

export function useUpdateMerchItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMerchItem }) => merchItemsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [MERCH_ITEMS_QUERY_KEY] }),
  });
}

export function useDeleteMerchItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: merchItemsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [MERCH_ITEMS_QUERY_KEY] }),
  });
}

export function useUploadMerchFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      kind,
      file,
      onProgress,
    }: {
      id: string;
      kind: 'model' | 'preview';
      file: File;
      onProgress?: UploadProgressHandler;
    }) =>
      kind === 'model'
        ? merchItemsApi.uploadModel(id, file, onProgress)
        : merchItemsApi.uploadPreview(id, file, onProgress),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [MERCH_ITEMS_QUERY_KEY] }),
  });
}
