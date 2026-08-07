import axios from 'axios';
import { store } from '@/app/store';
import { logout, setAccessToken } from '@/features/auth/authSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pendingRequests = [];

function onRefreshSuccess(token) {
  pendingRequests.forEach(({ resolve }) => resolve(token));
  pendingRequests = [];
}

function onRefreshFailure(error) {
  pendingRequests.forEach(({ reject }) => reject(error));
  pendingRequests = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url ?? '';

    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/refresh-token');

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post('/auth/refresh-token');
        const newToken = data?.data?.accessToken;
        if (!newToken) throw new Error('Refresh token response missing accessToken');

        store.dispatch(setAccessToken(newToken));
        onRefreshSuccess(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        onRefreshFailure(refreshError);
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;