import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { suspendUser } from '@/api/adminApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suspendUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('User suspended.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not suspend the user.' });
    },
  });
}