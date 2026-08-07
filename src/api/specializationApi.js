import axiosInstance from './axiosInstance';

export async function getSpecializations() {
  const { data } = await axiosInstance.get('/specializations');
  return data;
}