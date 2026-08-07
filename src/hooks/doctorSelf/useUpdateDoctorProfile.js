import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateDoctorProfileRequest } from '@/api/doctorApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDoctorProfileRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Profile updated.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not update your profile.' });
    },
  });
}