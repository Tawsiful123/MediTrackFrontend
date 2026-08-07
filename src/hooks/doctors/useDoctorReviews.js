import { useQuery } from '@tanstack/react-query';
import { getDoctorReviews } from '@/api/doctorPublicApi';

export function useDoctorReviews(id, params) {
  return useQuery({
    queryKey: ['doctors', 'reviews', id, params],
    queryFn: () => getDoctorReviews(id, params),
    enabled: Boolean(id),
  });
}
