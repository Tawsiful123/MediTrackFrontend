import { useMutation } from '@tanstack/react-query';
import { registerPatientRequest } from '@/api/authApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useRegisterPatient() {
  return useMutation({
    mutationFn: registerPatientRequest,
    onError: (error) => {
      handleApiError(error, { fallback: 'Registration failed. Please try again.' });
    },
  });
}