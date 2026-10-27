import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UploadProgressHandler } from '@/lib/api-client';
import type { UpdatePrint } from '@/types';
import { printsApi, type PrintsFilter } from '../api/prints-api';

export const PRINTS_QUERY_KEY = 'prints';

export function usePrintCategories() {
  return useQuery({
    queryKey: [PRINTS_QUERY_KEY, 'categories'],
    queryFn: printsApi.getCategories,
    staleTime: Infinity,
  });
}

export function usePrints(filter: PrintsFilter = {}) {
  return useQuery({
    queryKey: [PRINTS_QUERY_KEY, 'list', filter],
    queryFn: () => printsApi.getAll(filter),
  });
}

export function useCreatePrint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: printsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [PRINTS_QUERY_KEY] }),
  });
}

export function useUpdatePrint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePrint }) => printsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [PRINTS_QUERY_KEY] }),
  });
}

export function useDeletePrint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: printsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [PRINTS_QUERY_KEY] }),
  });
}

export function useUploadPrintImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file, onProgress }: { id: string; file: File; onProgress?: UploadProgressHandler }) =>
      printsApi.uploadImage(id, file, onProgress),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [PRINTS_QUERY_KEY] }),
  });
}
