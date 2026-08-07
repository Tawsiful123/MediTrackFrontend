import { useQuery } from '@tanstack/react-query';
import { getAssistants } from '@/api/adminApi';

export function useAssistantsList(params) {
  return useQuery({
    queryKey: ['assistants', params],
    queryFn: () => getAssistants(params),
    placeholderData: (prev) => prev,
  });
}