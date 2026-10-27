import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UpdateSavedConfiguration } from '@/types';
import { configurationsApi } from '../api/configurations-api';

export const CONFIGURATIONS_QUERY_KEY = 'configurations';

export function useConfigurations() {
  return useQuery({
    queryKey: [CONFIGURATIONS_QUERY_KEY, 'list'],
    queryFn: configurationsApi.getAll,
  });
}

export function useConfiguration(id: string | null | undefined) {
  return useQuery({
    queryKey: [CONFIGURATIONS_QUERY_KEY, id],
    queryFn: () => configurationsApi.getById(id!),
    enabled: !!id,
  });
}

export function useConfigurationByShareCode(shareCode: string | undefined) {
  return useQuery({
    queryKey: [CONFIGURATIONS_QUERY_KEY, 'share', shareCode],
    queryFn: () => configurationsApi.getByShareCode(shareCode!),
    enabled: !!shareCode,
    retry: false,
  });
}

export function useCreateConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: configurationsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CONFIGURATIONS_QUERY_KEY] }),
  });
}

export function useUpdateConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSavedConfiguration }) => configurationsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CONFIGURATIONS_QUERY_KEY] }),
  });
}

export function useDeleteConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: configurationsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [CONFIGURATIONS_QUERY_KEY] }),
  });
}

export const shareUrl = (shareCode: string) => `${window.location.origin}/c/${shareCode}`;
