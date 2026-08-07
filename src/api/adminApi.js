import axiosInstance from './axiosInstance';

export async function getAdminDashboard() {
  const { data } = await axiosInstance.get('/admin/dashboard');
  return data;
}

export async function getPendingDoctors() {
  const { data } = await axiosInstance.get('/admin/doctors/pending');
  return data;
}

export async function approveDoctor(id) {
  const { data } = await axiosInstance.patch(`/admin/doctors/${id}/approve`);
  return data;
}

export async function rejectDoctor({ id, reason }) {
  const { data } = await axiosInstance.patch(`/admin/doctors/${id}/reject`, { reason });
  return data;
}

export async function suspendDoctor(id) {
  const { data } = await axiosInstance.patch(`/admin/doctors/${id}/suspend`);
  return data;
}

export async function getUsers(params) {
  const { data } = await axiosInstance.get('/admin/users', { params });
  return data;
}

export async function activateUser(id) {
  const { data } = await axiosInstance.patch(`/admin/users/${id}/activate`);
  return data;
}

export async function suspendUser(id) {
  const { data } = await axiosInstance.patch(`/admin/users/${id}/suspend`);
  return data;
}

export async function deleteUser(id) {
  const { data } = await axiosInstance.delete(`/admin/users/${id}`);
  return data;
}

export async function getAssistants(params) {
  const { data } = await axiosInstance.get('/admin/assistants', { params });
  return data;
}

export async function assignAssistantDoctor(assistantId, doctorId) {
  const { data } = await axiosInstance.patch(
    `/admin/assistants/${assistantId}/assign-doctor`,
    { doctorId },
  );
  return data;
}

export async function suspendAssistant(id) {
  const { data } = await axiosInstance.patch(`/admin/assistants/${id}/suspend`);
  return data;
}

export async function getAdminReports() {
  const { data } = await axiosInstance.get('/admin/reports');
  return data;
}

export async function getAdminProfile() {
  const { data } = await axiosInstance.get('/admin/me');
  return data;
}

export async function updateAdminProfileRequest(body) {
  const { data } = await axiosInstance.patch('/admin/me', body);
  return data;
}