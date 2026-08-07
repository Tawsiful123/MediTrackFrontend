import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteUser } from '@/api/adminApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('User deleted.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not delete the user.' });
    },
  });
}