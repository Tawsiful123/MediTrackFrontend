import { useQuery } from '@tanstack/react-query';
import { getDoctorSelfReviews } from '@/api/doctorApi';

export function useDoctorReviews(params) {
  return useQuery({
    queryKey: ['doctor', 'reviews', params],
    queryFn: () => getDoctorSelfReviews(params),
  });
}