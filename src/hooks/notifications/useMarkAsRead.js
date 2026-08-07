import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAsReadRequest } from '@/api/notificationApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsReadRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not update notification.' });
    },
  });
}
