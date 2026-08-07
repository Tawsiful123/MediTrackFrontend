import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { rescheduleAppointmentRequest } from '@/api/appointmentApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rescheduleAppointmentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment rescheduled.');
    },
    onError: (error) => {
      if (error.response?.status === 403) {
        toast.error("This doesn't belong to your assigned doctor.");
        return;
      }
      handleApiError(error, { fallback: 'Could not reschedule the appointment.' });
    },
  });
}
