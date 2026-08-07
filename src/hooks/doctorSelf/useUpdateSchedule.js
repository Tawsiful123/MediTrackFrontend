import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateScheduleRequest } from '@/api/doctorApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateScheduleRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'schedule'] });
      toast.success('Schedule slot updated.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not update the schedule slot.' });
    },
  });
}