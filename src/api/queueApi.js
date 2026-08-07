import axiosInstance from './axiosInstance';

export async function getMyQueue() {
  const { data } = await axiosInstance.get('/queue/my');
  return data;
}

export async function getTodayQueue(doctorId) {
  const { data } = await axiosInstance.get('/queue/today', { params: { doctorId } });
  return data;
}

export async function callNextRequest(id) {
  const { data } = await axiosInstance.patch(`/queue/${id}/call-next`);
  return data;
}

export async function updateQueueStatusRequest({ id, status }) {
  const { data } = await axiosInstance.patch(`/queue/${id}/status`, { status });
  return data;
}