import { useQuery } from '@tanstack/react-query';
import { getAllReviews } from '@/api/reviewApi';

/**
 * Admin moderation list of all reviews across the practice.
 * @param {{ search?: string, page?: number, limit?: number }} params
 */
export function useAllReviews(params) {
  return useQuery({
    queryKey: ['reviews', 'all', params],
    queryFn: () => getAllReviews(params),
    placeholderData: (prev) => prev,
  });
}