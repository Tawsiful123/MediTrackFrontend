import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { suspendDoctor } from '@/api/adminApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useSuspendDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suspendDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('Doctor suspended.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not suspend the doctor.' });
    },
  });
}