import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginRequest, registerPatientRequest, registerDoctorRequest } from '@/api/authApi';
import { handleApiError } from '@/utils/getErrorMessage';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginRequest,
    onError: (error) => {
      handleApiError(error, { fallback: 'Login failed. Please try again.' });
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
      handleApiError(error, { fallback: 'Registration failed. Please try again.' });
    },
  });
}

export function useRegisterDoctor() {
  return useMutation({
    mutationFn: registerDoctorRequest,
    onError: (error) => {
      handleApiError(error, { fallback: 'Application failed. Please try again.' });
    },
  });
}