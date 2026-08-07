import { useQuery } from '@tanstack/react-query';
import { getDoctorSchedules } from '@/api/doctorApi';

export function useDoctorSchedules() {
  return useQuery({
    queryKey: ['doctor', 'schedule'],
    queryFn: getDoctorSchedules,
  });
}