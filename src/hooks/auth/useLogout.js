import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logoutRequest } from '@/api/authApi';
import { useAuth } from '@/features/auth/useAuth';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('Signed out. See you soon!');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Sign out failed. Please try again.'));
    },
  });
}