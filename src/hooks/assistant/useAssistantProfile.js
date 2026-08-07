import { useQuery } from '@tanstack/react-query';
import { getAssistantProfile } from '@/api/assistantApi';

export function useAssistantProfile() {
  return useQuery({
    queryKey: ['assistant', 'me'],
    queryFn: getAssistantProfile,
  });
}