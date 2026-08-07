import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { changePasswordRequest } from '@/api/authApi';
import { passwordChanged } from '@/features/auth/authSlice';
import { handleApiError } from '@/utils/getErrorMessage';

export function useChangePassword() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: changePasswordRequest,
    onSuccess: () => {
      dispatch(passwordChanged());
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Password change failed. Please try again.' });
    },
  });
}