import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { registerPatientRequest } from '@/api/authApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useRegisterPatient() {
  return useMutation({
    mutationFn: registerPatientRequest,
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Registration failed. Please try again.'));
    },
  });
}