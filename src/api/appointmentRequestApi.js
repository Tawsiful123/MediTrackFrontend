import axiosInstance from './axiosInstance';

export async function getAppointmentRequests(params) {
  const { data } = await axiosInstance.get('/appointments/requests', { params });
  return data;
}

export async function acceptRequest(id) {
  const { data } = await axiosInstance.patch(`/appointments/${id}/accept`);
  return data;
}

export async function rejectRequest({ id, reason }) {
  const { data } = await axiosInstance.patch(`/appointments/${id}/reject`, { reason });
  return data;
}