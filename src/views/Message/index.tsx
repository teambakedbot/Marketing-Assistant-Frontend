import { useState, useEffect, useCallback } from "react";
import { getChats, deleteChat, renameChat } from "../../utils/api";
import useAuth from "../../hooks/useAuth";
function ChatList() {
  const [chats, setChats] = useState([]);
  const [editingChatId, setEditingChatId] = useState(null);
  const [newChatName, setNewChatName] = useState("");
  const [savingChatId, setSavingChatId] = useState(null);
  const { user } = useAuth();

  const fetchChats = useCallback(async () => {
    const token = await user!.getIdToken();
    const fetchedChats = await getChats(token);
    setChats(fetchedChats);
  }, [user]);

  const handleDeleteChat = async (chatId) => {
    if (editingChatId) {
      alert("Please finish renaming before deleting.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this chat?")) {
      setSavingChatId(chatId);
      try {
        const token = await user!.getIdToken();
        await deleteChat(token, chatId);
        fetchChats();
      } catch (error) {
        console.error("Error deleting chat:", error);
        alert("Failed to delete chat. Please try again.");
      } finally {
        setSavingChatId(null);
      }
    }
  };

  const handleSaveRename = async (chatId) => {
    setSavingChatId(chatId);
    try {
      const token = await user!.getIdToken();
      await renameChat(token, chatId, newChatName);
      setEditingChatId(null);
      setNewChatName("");
      fetchChats();
    } catch (error) {
      console.error("Error renaming chat:", error);
      alert("Failed to rename chat. Please try again.");
    } finally {
      setSavingChatId(null);
    }
  };

  const handleCancelRename = () => {
    setEditingChatId(null);
    setNewChatName("");
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user, fetchChats]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Your Chats</h1>
      <ul className="w-full max-w-2xl space-y-4">
        {chats.map((chat: any) => (
          <li
            key={chat.chat_id}
            className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
          >
            {editingChatId === chat.chat_id ? (
              <input
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                className="bg-gray-700 text-white px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow mr-2"
                disabled={savingChatId === chat.chat_id}
              />
            ) : (
              <span className="text-lg flex-grow">{chat.name}</span>
            )}
            <div className="flex space-x-2">
              {editingChatId === chat.chat_id ? (
                <>
                  <button
                    onClick={() => handleSaveRename(chat.chat_id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={savingChatId === chat.chat_id}
                  >
                    {savingChatId === chat.chat_id ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancelRename}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={savingChatId === chat.chat_id}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditingChatId(chat.chat_id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={savingChatId === chat.chat_id}
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => handleDeleteChat(chat.chat_id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={savingChatId === chat.chat_id}
                  >
                    {savingChatId === chat.chat_id ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;
