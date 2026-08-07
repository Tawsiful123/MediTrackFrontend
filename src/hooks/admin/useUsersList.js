import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/api/adminApi';

/**
 * GET /admin/users — paginated user directory.
 * @param {{ search?: string, role?: string, status?: string, page?: number, limit?: number }} params
 */
export function useUsersList(params) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => getUsers(params),
    placeholderData: (prev) => prev,
  });
}