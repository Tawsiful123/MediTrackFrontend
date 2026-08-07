import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cancelAppointmentRequest } from '@/api/appointmentApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAppointmentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'dashboard'] });
      toast.success('Appointment cancelled.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not cancel the appointment.'));
    },
  });
}
