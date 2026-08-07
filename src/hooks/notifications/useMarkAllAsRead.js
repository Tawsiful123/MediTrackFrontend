import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAllAsReadRequest } from '@/api/notificationApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsReadRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not update notifications.' });
    },
  });
}
