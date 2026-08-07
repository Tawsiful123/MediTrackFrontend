import { useQuery } from '@tanstack/react-query';
import { getDoctorProfile } from '@/api/doctorApi';

export function useDoctorProfile() {
  return useQuery({
    queryKey: ['doctor', 'me'],
    queryFn: getDoctorProfile,
  });
}