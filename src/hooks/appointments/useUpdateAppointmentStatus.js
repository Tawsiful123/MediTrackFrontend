import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateAppointmentStatusRequest } from '@/api/appointmentApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAppointmentStatusRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment status updated.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not update the appointment.' });
    },
  });
}