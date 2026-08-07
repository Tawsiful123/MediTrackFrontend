import { useQuery } from '@tanstack/react-query';
import { getAppointmentDetail } from '@/api/appointmentApi';

export function useAppointmentDetail(id) {
  return useQuery({
    queryKey: ['appointments', 'detail', id],
    queryFn: () => getAppointmentDetail(id),
    enabled: Boolean(id),
  });
}
