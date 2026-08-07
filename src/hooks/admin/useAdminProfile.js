import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getAdminProfile, updateAdminProfileRequest } from '@/api/adminApi';
import { useQuery } from '@tanstack/react-query';
import { handleApiError } from '@/utils/getErrorMessage';

export function useAdminProfile() {
  return useQuery({
    queryKey: ['admin', 'me'],
    queryFn: getAdminProfile,
  });
}

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminProfileRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'me'] });
      toast.success('Profile updated.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not update your profile.' });
    },
  });
}