import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteNotificationRequest } from '@/api/notificationApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotificationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not delete notification.'));
    },
  });
}
