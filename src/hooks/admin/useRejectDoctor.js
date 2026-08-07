import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { rejectDoctor } from '@/api/adminApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useRejectDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pendingDoctors'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('Doctor application rejected.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not reject the application.' });
    },
  });
}