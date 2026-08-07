import { useQuery } from '@tanstack/react-query';
import { getAdminDashboard } from '@/api/adminApi';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: getAdminDashboard,
  });
}