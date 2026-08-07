import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateQueueStatusRequest } from '@/api/queueApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useUpdateQueueStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateQueueStatusRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue', 'today'] });
      toast.success('Queue status updated.');
    },
    onError: (error) => {
      if (error.response?.status === 403) {
        toast.error("This doesn't belong to your assigned doctor.");
        return;
      }
      handleApiError(error, { fallback: 'Could not update the queue status.' });
    },
  });
}