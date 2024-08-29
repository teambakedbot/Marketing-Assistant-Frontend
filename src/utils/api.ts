import axios from "axios";

// const BASE_URL = "http://0.0.0.0:8080";
const BASE_URL =
  "https://cannabis-marketing-chatbot-224bde0578da.herokuapp.com";

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
