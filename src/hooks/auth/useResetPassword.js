import { useMutation } from '@tanstack/react-query';
import { resetPasswordRequest } from '@/api/authApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordRequest,
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not reset password. Please try again.' });
    },
  });
}