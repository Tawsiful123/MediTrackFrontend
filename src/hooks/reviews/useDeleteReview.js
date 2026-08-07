import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteReviewRequest } from '@/api/reviewApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReviewRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Review deleted.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not delete the review.' });
    },
  });
}
