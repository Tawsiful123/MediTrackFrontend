import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { rescheduleAppointmentRequest } from '@/api/appointmentApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rescheduleAppointmentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment rescheduled.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not reschedule the appointment.'));
    },
  });
}
