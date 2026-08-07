import { useQuery } from '@tanstack/react-query';
import { getMyQueue } from '@/api/queueApi';

export function useMyQueue() {
  return useQuery({
    queryKey: ['queue', 'my'],
    queryFn: getMyQueue,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}
