import { useQuery } from '@tanstack/react-query';
import { getMyAppointments } from '@/api/appointmentApi';

export function useMyAppointments(params) {
  return useQuery({
    queryKey: ['appointments', 'mine', params],
    queryFn: () => getMyAppointments(params),
    placeholderData: (prev) => prev,
  });
}
