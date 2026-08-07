import { useQuery } from '@tanstack/react-query';
import { getMyReviews } from '@/api/reviewApi';

export function useMyReviews(params) {
  return useQuery({
    queryKey: ['reviews', 'my', params],
    queryFn: () => getMyReviews(params),
    placeholderData: (prev) => prev,
  });
}
