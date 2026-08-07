import axiosInstance from './axiosInstance';

export async function askChatbot(message) {
  const { data } = await axiosInstance.post('/chatbot/ask', { message });
  return data;
}

export async function getChatbotHistory(params) {
  const { data } = await axiosInstance.get('/chatbot/history', { params });
  return data;
}