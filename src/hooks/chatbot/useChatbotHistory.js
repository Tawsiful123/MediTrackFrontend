import { useQuery } from '@tanstack/react-query';
import { getChatbotHistory } from '@/api/chatbotApi';

/**
 * GET /chatbot/history — past conversations with the health assistant,
 * paginated via the standard { page, limit } params.
 */
export function useChatbotHistory(params) {
  return useQuery({
    queryKey: ['chatbot', 'history', params],
    queryFn: () => getChatbotHistory(params),
    placeholderData: (prev) => prev,
  });
}