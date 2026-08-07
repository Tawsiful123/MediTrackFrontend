import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateAssistantProfileRequest } from '@/api/assistantApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useUpdateAssistantProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAssistantProfileRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistant', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Profile updated.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not update your profile.' });
    },
  });
}