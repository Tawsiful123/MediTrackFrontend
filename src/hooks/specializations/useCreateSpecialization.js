import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createSpecializationRequest } from '@/api/specializationApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useCreateSpecialization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSpecializationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializations'] });
      toast.success('Specialization created.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not create the specialization.' });
    },
  });
}