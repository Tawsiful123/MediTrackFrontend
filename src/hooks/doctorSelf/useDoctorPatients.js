import { useQuery } from '@tanstack/react-query';
import { getDoctorPatients } from '@/api/doctorApi';

export function useDoctorPatients(params) {
  return useQuery({
    queryKey: ['doctor', 'patients', params],
    queryFn: () => getDoctorPatients(params),
    placeholderData: (prev) => prev,
  });
}