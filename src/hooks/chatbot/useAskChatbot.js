import { useMutation } from '@tanstack/react-query';
import { askChatbot } from '@/api/chatbotApi';

/**
 * POST /chatbot/ask — send a symptom message and receive the assistant reply.
 * The page handles success (append reply) and 500 retry UX itself, so this
 * hook stays thin and does not toast.
 */
export function useAskChatbot() {
  return useMutation({
    mutationFn: (message) => askChatbot(message),
  });
}