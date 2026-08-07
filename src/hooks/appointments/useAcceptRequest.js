import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { acceptRequest } from '@/api/appointmentRequestApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useAcceptRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentRequests'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['assistant', 'dashboard'] });
      toast.success('Appointment accepted.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not accept the request.' });
    },
  });
}