import { useQuery } from '@tanstack/react-query';
import { getDoctorDashboard } from '@/api/doctorApi';

export function useDoctorDashboard() {
  return useQuery({
    queryKey: ['doctor', 'dashboard'],
    queryFn: getDoctorDashboard,
  });
}