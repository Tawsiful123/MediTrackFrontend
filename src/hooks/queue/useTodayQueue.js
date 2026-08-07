import { useQuery } from '@tanstack/react-query';
import { getTodayQueue } from '@/api/queueApi';

export function useTodayQueue(doctorId) {
  return useQuery({
    queryKey: ['queue', 'today', doctorId],
    queryFn: () => getTodayQueue(doctorId),
    refetchInterval: 15 * 1000,
    refetchOnWindowFocus: true,
  });
}