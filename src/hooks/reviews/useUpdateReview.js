import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateReviewRequest } from '@/api/reviewApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReviewRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Review updated.');
    },
    onError: (error) => {
      handleApiError(error, { fallback: 'Could not update the review.' });
    },
  });
}
