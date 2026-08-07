import axiosInstance from './axiosInstance';

export async function getAssistantProfile() {
  const { data } = await axiosInstance.get('/assistant/me');
  return data;
}

export async function updateAssistantProfileRequest(body) {
  const { data } = await axiosInstance.patch('/assistant/me', body);
  return data;
}

export async function getAssistantDashboard() {
  const { data } = await axiosInstance.get('/assistant/me/dashboard');
  return data;
}

export async function getAssignedDoctor() {
  const { data } = await axiosInstance.get('/assistant/me/doctor');
  return data;
}