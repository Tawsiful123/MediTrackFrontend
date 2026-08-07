import { store } from '@/app/store';
import { setAccessToken, setCredentials } from '@/features/auth/authSlice';
import axiosInstance from '@/api/axiosInstance';

/**
 * On app bootstrap, silently try to restore a session via the httpOnly
 * refresh-token cookie (planning.md §5.3). Fails silently on public pages;
 * the axios 401 flow handles the redirect when a protected page is hit.
 *
 * Response envelope: { data: { accessToken, user?, needsPasswordChange? } }
 * — when `user` is included, restore the full session; otherwise only the token.
 */
export async function bootstrapAuth() {
  try {
    const { data } = await axiosInstance.post('/auth/refresh-token');
    const { accessToken, user, needsPasswordChange } = data?.data ?? {};

    if (!accessToken) return;

    if (user) {
      store.dispatch(setCredentials({ user, accessToken, needsPasswordChange: needsPasswordChange ?? false }));
    } else {
      store.dispatch(setAccessToken(accessToken));
    }
  } catch {
    // No session — stay logged out.
  }
}
