import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { forgotPasswordRequest } from '@/api/authApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordRequest,
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not send reset link. Please try again.'));
    },
  });
}