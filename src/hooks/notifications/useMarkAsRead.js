import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { markAsReadRequest } from '@/api/notificationApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsReadRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not update notification.'));
    },
  });
}
