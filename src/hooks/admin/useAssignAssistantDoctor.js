import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignAssistantDoctor } from '@/api/adminApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useAssignAssistantDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assistantId, doctorId }) => assignAssistantDoctor(assistantId, doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not update the assistant assignment.' });
    },
  });
}