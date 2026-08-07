import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bookAppointmentRequest } from '@/api/appointmentApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useBookAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookAppointmentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'dashboard'] });
      toast.success('Appointment requested! Awaiting confirmation.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Booking failed. Please try again.'));
    },
  });
}
