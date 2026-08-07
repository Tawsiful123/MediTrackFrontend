import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateSpecializationRequest } from '@/api/specializationApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useUpdateSpecialization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSpecializationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializations'] });
      toast.success('Specialization updated.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not update the specialization.' });
    },
  });
}