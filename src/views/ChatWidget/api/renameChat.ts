import axios from "axios";
import { BASE_URL } from "../../../utils/api";
import { ThemeSettings } from "../settings";

export const renameChat = async (
  token: string,
  chatId: string,
  newName: string
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/chat/rename?chat_id=${chatId}&new_name=${newName}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error renaming chat:", error);
    throw error;
  }
};

export const saveThemeSettings = async (
  token: string,
  settings: ThemeSettings
) => {
  await axios.post(`${BASE_URL}/users/theme`, settings, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getThemeSettings = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/users/theme`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
