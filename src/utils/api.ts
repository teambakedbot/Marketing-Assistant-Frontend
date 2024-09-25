import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BASE_URL as string;

export const getChats = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/user/chats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.chats;
};

export const getChatMessages = async (token: string, chatId: string) => {
  const response = await axios.get(
    `${BASE_URL}/chat/messages?chat_id=${chatId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.messages;
};

export const sendMessage = async (
  token: string,
  message: string,
  voiceType: string,
  chatId: string | null
) => {
  const response = await axios.post(
    `${BASE_URL}/chat`,
    { message, voice_type: voiceType, chat_id: chatId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const renameChat = async (
  token: string,
  chatId: string,
  newName: string
) => {
  const response = await axios.put(
    `${BASE_URL}/chat/rename?chat_id=${chatId}&new_name=${newName}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteChat = async (token: string, chatId: string) => {
  const response = await axios.delete(`${BASE_URL}/chat/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const recordFeedback = async (
  token: string,
  message_id: string,
  feedback_type: string
) => {
  const response = await axios.post(
    `${BASE_URL}/feedback`,
    { message_id, feedback_type },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const retryMessage = async (token: string, message_id: string) => {
  const response = await axios.post(
    `${BASE_URL}/retry`,
    { message_id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const checkout = async (
  token: string,
  checkoutData: {
    name: string;
    contact_info: { email?: string; phone?: string };
    cart: Record<string, { quantity: number }>;
  }
) => {
  const response = await axios.post(`${BASE_URL}/checkout`, checkoutData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
