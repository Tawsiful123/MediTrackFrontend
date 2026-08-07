import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createReviewRequest } from '@/api/reviewApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReviewRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Review submitted. Thank you!');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not submit the review.'));
    },
  });
}
