import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { changePasswordRequest } from '@/api/authApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useChangePassword() {
  return useMutation({
    mutationFn: changePasswordRequest,
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Password change failed. Please try again.'));
    },
  });
}