import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { removeAssistant } from '@/api/adminApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useRemoveAssistant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeAssistant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Assistant unassigned from the doctor.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not unassign the assistant.' });
    },
  });
}