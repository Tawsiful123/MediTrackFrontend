import { useQuery } from '@tanstack/react-query';
import { getSpecializations } from '@/api/specializationApi';

export function useSpecializations() {
  return useQuery({
    queryKey: ['specializations'],
    queryFn: getSpecializations,
  });
}