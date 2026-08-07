import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { callNextRequest } from '@/api/queueApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useCallNext() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: callNextRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue', 'today'] });
      toast.success('Patient called.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not call the next patient.' });
    },
  });
}