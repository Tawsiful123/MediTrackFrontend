import axiosInstance from './axiosInstance';

export async function getNotifications({ page = 1, limit = 10 } = {}) {
  const { data } = await axiosInstance.get('/notifications', { params: { page, limit } });
  return data;
}

export async function markAsReadRequest(id) {
  const { data } = await axiosInstance.patch(`/notifications/${id}/read`);
  return data;
}

export async function markAllAsReadRequest() {
  const { data } = await axiosInstance.patch('/notifications/read-all');
  return data;
}

export async function deleteNotificationRequest(id) {
  const { data } = await axiosInstance.delete(`/notifications/${id}`);
  return data;
}
