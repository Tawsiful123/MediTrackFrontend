import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import toast from 'react-hot-toast';

export async function loginRequest(values) {
  const { data } = await axiosInstance.post('/auth/login', values);
  return data;
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginRequest,
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Login failed. Please try again.');
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}