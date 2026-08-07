import axiosInstance from './axiosInstance';

export async function getPatientDashboard() {
  const { data } = await axiosInstance.get('/patient/dashboard');
  return data;
}

export async function getPatientProfile() {
  const { data } = await axiosInstance.get('/patient/profile');
  return data;
}

export async function updatePatientProfileRequest(body) {
  const { data } = await axiosInstance.patch('/patient/profile', body);
  return data;
}
