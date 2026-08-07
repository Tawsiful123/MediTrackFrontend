import { useQuery } from '@tanstack/react-query';
import { getAppointmentRequests } from '@/api/appointmentRequestApi';

export function useAppointmentRequests(params) {
  return useQuery({
    queryKey: ['appointmentRequests', params],
    queryFn: () => getAppointmentRequests(params),
    placeholderData: (prev) => prev,
  });
}