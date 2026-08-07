import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteSpecializationRequest } from '@/api/specializationApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useDeleteSpecialization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSpecializationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializations'] });
      toast.success('Specialization deleted.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not delete the specialization.' });
    },
  });
}