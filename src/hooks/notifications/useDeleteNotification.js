import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNotificationRequest } from '@/api/notificationApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotificationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not delete notification.' });
    },
  });
}
