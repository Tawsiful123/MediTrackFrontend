import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

export async function getNotifications({ page = 1, limit = 10 } = {}) {
  const { data } = await axiosInstance.get('/notifications', { params: { page, limit } });
  return data;
}

export function useNotifications(params) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => getNotifications(params),
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}