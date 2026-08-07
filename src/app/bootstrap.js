import { store } from '@/app/store';
import { setAccessToken } from '@/features/auth/authSlice';
import axiosInstance from '@/api/axiosInstance';

/**
 * On app bootstrap, silently try to restore a session via the httpOnly
 * refresh-token cookie (planning.md §5.3). Fails silently on public pages;
 * the axios 401 flow handles the redirect when a protected page is hit.
 */
export async function bootstrapAuth() {
  try {
    const { data } = await axiosInstance.post('/auth/refresh-token');
    const accessToken = data?.data?.accessToken;
    if (accessToken) store.dispatch(setAccessToken(accessToken));
  } catch {
    // No session — stay logged out.
  }
}