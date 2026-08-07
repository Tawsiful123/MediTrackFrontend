import axiosInstance from './axiosInstance';

export async function getDoctors(params) {
  const { data } = await axiosInstance.get('/doctors', { params });
  return data;
}

export async function getDoctorDetail(id) {
  const { data } = await axiosInstance.get(`/doctors/${id}`);
  return data;
}

export async function getDoctorReviews(id, params) {
  const { data } = await axiosInstance.get(`/doctors/${id}/reviews`, { params });
  return data;
}

export async function getDoctorSchedule(id) {
  const { data } = await axiosInstance.get(`/doctors/${id}/schedule`);
  return data;
}

export async function getNearbyDoctors(params) {
  const { data } = await axiosInstance.get('/doctors/nearby', { params });
  return data;
}
