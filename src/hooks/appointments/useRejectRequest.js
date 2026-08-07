import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { rejectRequest } from '@/api/appointmentRequestApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useRejectRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentRequests'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['assistant', 'dashboard'] });
      toast.success('Appointment request rejected.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not reject the request.' });
    },
  });
}