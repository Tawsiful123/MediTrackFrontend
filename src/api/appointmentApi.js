import axiosInstance from './axiosInstance';

export async function bookAppointmentRequest(body) {
  const { data } = await axiosInstance.post('/appointments/book', body);
  return data;
}

export async function getMyAppointments(params) {
  const { data } = await axiosInstance.get('/appointments/mine', { params });
  return data;
}

export async function getAppointmentDetail(id) {
  const { data } = await axiosInstance.get(`/appointments/${id}`);
  return data;
}

export async function cancelAppointmentRequest(id) {
  const { data } = await axiosInstance.patch(`/appointments/${id}/cancel`);
  return data;
}

export async function rescheduleAppointmentRequest({ id, ...body }) {
  const { data } = await axiosInstance.patch(`/appointments/${id}/reschedule`, body);
  return data;
}
