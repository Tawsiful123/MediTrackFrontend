import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials, setAccessToken, setUser, passwordChanged } from '@/features/auth/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, accessToken, isAuthenticated, needsPasswordChange } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    accessToken,
    isAuthenticated,
    needsPasswordChange,
    role: user?.role ?? null,
    login: (payload) => dispatch(setCredentials(payload)),
    setToken: (token) => dispatch(setAccessToken(token)),
    updateUser: (userData) => dispatch(setUser(userData)),
    clearPasswordChangeFlag: () => dispatch(passwordChanged()),
    logout: () => dispatch(logout()),
  };
}