import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { registerDoctorRequest } from '@/api/authApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useRegisterDoctor() {
  return useMutation({
    mutationFn: registerDoctorRequest,
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Application failed. Please try again.'));
    },
  });
}