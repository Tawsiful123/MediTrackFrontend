import { useQuery } from '@tanstack/react-query';
import { getAdminReports } from '@/api/adminApi';

export function useAdminReports() {
  return useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: getAdminReports,
  });
}