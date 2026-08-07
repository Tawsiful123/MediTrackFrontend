import axiosInstance from './axiosInstance';

export async function getSpecializations() {
  const { data } = await axiosInstance.get('/specializations');
  return data;
}

export async function createSpecializationRequest(body) {
  const { data } = await axiosInstance.post('/specializations', body);
  return data;
}

export async function updateSpecializationRequest({ id, ...body }) {
  const { data } = await axiosInstance.patch(`/specializations/${id}`, body);
  return data;
}

export async function deleteSpecializationRequest(id) {
  const { data } = await axiosInstance.delete(`/specializations/${id}`);
  return data;
}