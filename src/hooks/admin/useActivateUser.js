import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { activateUser } from '@/api/adminApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useActivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('User activated.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not activate the user.' });
    },
  });
}