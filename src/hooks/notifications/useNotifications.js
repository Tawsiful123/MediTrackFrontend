import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/api/notificationApi';

export function useNotifications(params) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => getNotifications(params),
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}
