import { useQuery } from '@tanstack/react-query';
import { getDoctors } from '@/api/doctorPublicApi';

export function useDoctorsList(params) {
  return useQuery({
    queryKey: ['doctors', 'list', params],
    queryFn: () => getDoctors(params),
    placeholderData: (prev) => prev,
  });
}
