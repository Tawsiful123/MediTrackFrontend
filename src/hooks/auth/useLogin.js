import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { loginRequest, registerPatientRequest, registerDoctorRequest } from '@/api/authApi';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginRequest,
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Login failed. Please try again.'));
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useRegisterPatient() {
  return useMutation({
    mutationFn: registerPatientRequest,
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Registration failed. Please try again.'));
    },
  });
}

export function useRegisterDoctor() {
  return useMutation({
    mutationFn: registerDoctorRequest,
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Application failed. Please try again.'));
    },
  });
}