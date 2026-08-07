import { useQuery } from '@tanstack/react-query';
import { getAllAppointments } from '@/api/appointmentApi';

export function useAllAppointments(params) {
  return useQuery({
    queryKey: ['appointments', 'all', params],
    queryFn: () => getAllAppointments(params),
    placeholderData: (prev) => prev,
  });
}