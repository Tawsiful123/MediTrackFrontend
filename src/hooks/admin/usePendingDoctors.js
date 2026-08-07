import { useQuery } from '@tanstack/react-query';
import { getPendingDoctors } from '@/api/adminApi';

export function usePendingDoctors() {
  return useQuery({
    queryKey: ['admin', 'pendingDoctors'],
    queryFn: getPendingDoctors,
  });
}