import { useMutation } from '@tanstack/react-query';
import { registerDoctorRequest } from '@/api/authApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useRegisterDoctor() {
  return useMutation({
    mutationFn: registerDoctorRequest,
    onError: (error) => {
      handleApiError(error, { fallback: 'Application failed. Please try again.' });
    },
  });
}