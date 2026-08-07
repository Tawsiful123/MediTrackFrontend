import { useQuery } from '@tanstack/react-query';
import { getAssistantDashboard } from '@/api/assistantApi';

export function useAssistantDashboard() {
  return useQuery({
    queryKey: ['assistant', 'dashboard'],
    queryFn: getAssistantDashboard,
  });
}