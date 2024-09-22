import axios from "axios";
import { BASE_URL } from "../utils/api";

export const renameChat = async (
  chatId: string,
  newName: string,
  user: any
) => {
  try {
    const token = await user?.getIdToken();
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
