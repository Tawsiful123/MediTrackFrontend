import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { markAllAsReadRequest } from '@/api/notificationApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsReadRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not update notifications.'));
    },
  });
}
