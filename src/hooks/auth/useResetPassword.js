import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { resetPasswordRequest } from '@/api/authApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordRequest,
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not reset password. Please try again.'));
    },
  });
}