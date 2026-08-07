import { useQuery } from '@tanstack/react-query';
import { getTodaysPatients } from '@/api/doctorApi';

export function useTodaysPatients() {
  return useQuery({
    queryKey: ['doctor', 'patients', 'today'],
    queryFn: getTodaysPatients,
  });
}