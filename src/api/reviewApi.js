import axiosInstance from './axiosInstance';

export async function getMyReviews(params) {
  const { data } = await axiosInstance.get('/reviews/my', { params });
  return data;
}

export async function getAllReviews(params) {
  const { data } = await axiosInstance.get('/reviews', { params });
  return data;
}

export async function createReviewRequest(body) {
  const { data } = await axiosInstance.post('/reviews', body);
  return data;
}

export async function updateReviewRequest({ id, ...body }) {
  const { data } = await axiosInstance.patch(`/reviews/${id}`, body);
  return data;
}

export async function deleteReviewRequest(id) {
  const { data } = await axiosInstance.delete(`/reviews/${id}`);
  return data;
}
