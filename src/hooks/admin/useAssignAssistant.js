import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { assignAssistant } from '@/api/adminApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useAssignAssistant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignAssistant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Assistant assigned to the doctor.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not assign the assistant.' });
    },
  });
}