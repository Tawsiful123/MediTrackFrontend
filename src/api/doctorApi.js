import axiosInstance from './axiosInstance';

export async function getDoctorProfile() {
  const { data } = await axiosInstance.get('/doctor/me');
  return data;
}

export async function updateDoctorProfileRequest(body) {
  const { data } = await axiosInstance.patch('/doctor/me', body);
  return data;
}

export async function getDoctorDashboard() {
  const { data } = await axiosInstance.get('/doctor/me/dashboard');
  return data;
}

export async function getDoctorSchedules() {
  const { data } = await axiosInstance.get('/doctor/me/schedule');
  return data;
}

export async function createScheduleRequest(body) {
  const { data } = await axiosInstance.post('/doctor/me/schedule', body);
  return data;
}

export async function updateScheduleRequest({ id, ...body }) {
  const { data } = await axiosInstance.patch(`/doctor/me/schedule/${id}`, body);
  return data;
}

export async function deleteScheduleRequest(id) {
  const { data } = await axiosInstance.delete(`/doctor/me/schedule/${id}`);
  return data;
}

export async function updateClinicLocationRequest(body) {
  const { data } = await axiosInstance.patch('/doctor/me/clinic-location', body);
  return data;
}

export async function getTodaysPatients() {
  const { data } = await axiosInstance.get('/doctor/me/patients/today');
  return data;
}

export async function getDoctorPatients(params) {
  const { data } = await axiosInstance.get('/doctor/me/patients', { params });
  return data;
}

export async function getDoctorSelfReviews(params) {
  const { data } = await axiosInstance.get('/doctor/me/reviews', { params });
  return data;
}