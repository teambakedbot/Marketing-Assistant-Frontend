import axios from "axios";

const BASE_URLx = "http://0.0.0.0:8000/api/v1";
const BASE_URL =
  "https://cannabis-marketing-chatbot-224bde0578da.herokuapp.com/api/v1";

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
