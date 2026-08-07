import { useQuery } from '@tanstack/react-query';
import { getDoctorSchedule } from '@/api/doctorPublicApi';

export function useDoctorSchedule(id) {
  return useQuery({
    queryKey: ['doctors', 'schedule', id],
    queryFn: () => getDoctorSchedule(id),
    enabled: Boolean(id),
  });
}
