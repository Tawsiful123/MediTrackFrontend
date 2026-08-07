import { useQuery } from '@tanstack/react-query';
import { getDoctorDetail } from '@/api/doctorPublicApi';

export function useDoctorDetail(id) {
  return useQuery({
    queryKey: ['doctors', 'detail', id],
    queryFn: () => getDoctorDetail(id),
    enabled: Boolean(id),
  });
}
