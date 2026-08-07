import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updatePatientProfileRequest } from '@/api/patientApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePatientProfileRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Profile updated.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not update your profile.'));
    },
  });
}
