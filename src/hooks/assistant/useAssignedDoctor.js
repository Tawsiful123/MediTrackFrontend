import { useQuery } from '@tanstack/react-query';
import { getAssignedDoctor } from '@/api/assistantApi';

export function useAssignedDoctor() {
  return useQuery({
    queryKey: ['assistant', 'doctor'],
    queryFn: getAssignedDoctor,
  });
}