import { useMutation } from '@tanstack/react-query';
import { forgotPasswordRequest } from '@/api/authApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordRequest,
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not send reset link. Please try again.' });
    },
  });
}