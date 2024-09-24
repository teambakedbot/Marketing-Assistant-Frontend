import React, { useState, useCallback, useEffect } from "react";
import ChatHeader from "../ChatHeader/index.tsx";
import ChatBody from "../ChatBody/index.tsx";
import ChatInput from "../ChatInput/index.tsx";
import SideMenu from "../SideMenu/index.tsx";
import StoreView from "../StoreView/index.tsx";
import ProductDetailView from "../ProductDetailView/index.tsx";
import SettingsPage from "../SettingsPage/index.tsx";
import { getChats, getChatMessages, sendMessage } from "../../../utils/api";
import { ThemeSettings } from "../SettingsPage";
import useAuth from "../../../hooks/useAuth";
interface ChatContainerProps {
  onClose: () => void;
  settings: ThemeSettings;
  onSaveSettings: (settings: ThemeSettings) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  onClose,
  settings,
  onSaveSettings,
}) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<
    "chat" | "store" | "product" | "settings"
  >("chat");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ... (move other state variables and functions from ChatWidget)

  const fetchUserChats = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const fetchedChats = await getChats(token);
      setChats(fetchedChats);
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchUserChats();
  }, [fetchUserChats]);

  const loadChatHistory = useCallback(
    async (chatId: string | null) => {
      // ... (move loadChatHistory logic from ChatWidget)
    },
    [user]
  );

  const handleSendMessage = async (message: string) => {
    // ... (move message sending logic from ChatWidget)
  };

  const toggleMenu = () => {
    // ... (move toggleMenu logic from ChatWidget)
  };

  return (
    <div className="bb-sm-chat-container">
      <ChatHeader
        currentView={currentView}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        onClose={onClose}
        onViewStore={() => setCurrentView("store")}
      />
      <ChatBody
        currentView={currentView}
        isNewChat={isNewChat}
        chatHistory={chatHistory}
        loading={loading}
        selectedProduct={selectedProduct}
        settings={settings}
        onSaveSettings={onSaveSettings}
        onBack={() => setCurrentView("chat")}
      />
      {currentView !== "product" && (
        <ChatInput
          currentView={currentView}
          onSendMessage={handleSendMessage}
          onSearch={() => {
            /* Implement search logic */
          }}
        />
      )}
      <SideMenu
        isOpen={isMenuOpen}
        chats={chats}
        activeChatId={currentChatId}
        onChatSelect={loadChatHistory}
        onNewChat={() => loadChatHistory(null)}
        onViewSettings={() => setCurrentView("settings")}
        onViewStore={() => setCurrentView("store")}
      />
    </div>
  );
};

export default ChatContainer;
