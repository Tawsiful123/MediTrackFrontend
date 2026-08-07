import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteScheduleRequest } from '@/api/doctorApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteScheduleRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'schedule'] });
      toast.success('Schedule slot deleted.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not delete the schedule slot.' });
    },
  });
}