import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { approveDoctor } from '@/api/adminApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useApproveDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pendingDoctors'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('Doctor approved. They can now log in and start practising.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not approve the doctor.' });
    },
  });
}