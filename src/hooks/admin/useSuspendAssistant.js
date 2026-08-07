import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { suspendAssistant } from '@/api/adminApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useSuspendAssistant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suspendAssistant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Assistant suspended.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not suspend the assistant.' });
    },
  });
}