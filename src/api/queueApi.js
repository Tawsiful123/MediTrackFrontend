import axiosInstance from './axiosInstance';

export async function getMyQueue() {
  const { data } = await axiosInstance.get('/queue/my');
  return data;
}
