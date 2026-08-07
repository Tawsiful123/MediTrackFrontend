import axiosInstance from './axiosInstance';

export async function loginRequest(body) {
  const { data } = await axiosInstance.post('/auth/login', body);
  return data;
}

export async function registerPatientRequest(body) {
  const { data } = await axiosInstance.post('/auth/register/patient', body);
  return data;
}

export async function registerDoctorRequest(body) {
  const { data } = await axiosInstance.post('/auth/register/doctor', body);
  return data;
}

export async function logoutRequest() {
  const { data } = await axiosInstance.post('/auth/logout');
  return data;
}

export async function changePasswordRequest(body) {
  const { data } = await axiosInstance.post('/auth/change-password', body);
  return data;
}

export async function forgotPasswordRequest(body) {
  const { data } = await axiosInstance.post('/auth/forgot-password', body);
  return data;
}

export async function resetPasswordRequest(body) {
  const { data } = await axiosInstance.post('/auth/reset-password', body);
  return data;
}