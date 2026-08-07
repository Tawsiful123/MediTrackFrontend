import { useMutation } from '@tanstack/react-query';
import { registerAssistantRequest } from '@/api/authApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useRegisterAssistant() {
  return useMutation({
    mutationFn: registerAssistantRequest,
    onError: (error) => {
      handleApiError(error, { fallback: 'Registration failed. Please try again.' });
    },
  });
}