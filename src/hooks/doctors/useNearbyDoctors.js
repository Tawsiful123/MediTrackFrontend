import { useQuery } from '@tanstack/react-query';
import { getNearbyDoctors } from '@/api/doctorPublicApi';

export function useNearbyDoctors(params) {
  return useQuery({
    queryKey: ['doctors', 'nearby', params],
    queryFn: () => getNearbyDoctors(params),
    placeholderData: (prev) => prev,
  });
}
