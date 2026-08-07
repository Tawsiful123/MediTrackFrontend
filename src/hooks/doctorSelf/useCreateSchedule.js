import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createScheduleRequest } from '@/api/doctorApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createScheduleRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'schedule'] });
      toast.success('Schedule slot created.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not create the schedule slot.' });
    },
  });
}