import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateClinicLocationRequest } from '@/api/doctorApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useUpdateClinicLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClinicLocationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'me'] });
      toast.success('Clinic location updated.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not update the clinic location.' });
    },
  });
}