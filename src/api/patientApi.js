import axiosInstance from './axiosInstance';

export async function getPatientDashboard() {
  const { data } = await axiosInstance.get('/patients/me/dashboard');
  return data;
}

export async function getPatientProfile() {
  const { data } = await axiosInstance.get('/patients/me');
  return data;
}

export async function updatePatientProfileRequest(body) {
  const { data } = await axiosInstance.patch('/patients/me', body);
  return data;
}
