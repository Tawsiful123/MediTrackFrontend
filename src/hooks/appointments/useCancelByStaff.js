import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cancelByStaffRequest } from '@/api/appointmentApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useCancelByStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelByStaffRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['assistant', 'dashboard'] });
      toast.success('Appointment cancelled.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not cancel the appointment.' });
    },
  });
}