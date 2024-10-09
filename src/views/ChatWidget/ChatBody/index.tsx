import React from "react";
import StoreView from "../StoreView/index.tsx";
import ProductDetailView from "../ProductDetailView/index.tsx";
import SettingsPage from "../SettingsPage/index.tsx";
import ChatHistory from "../ChatHistory/index.tsx";
import NewChatView from "../NewChatView/index.tsx";
import { ThemeSettings } from "../settings";

interface ChatBodyProps {
  currentView: "chat" | "store" | "product" | "settings";
  isNewChat: boolean;
  chatHistory: { type: string; content: string }[];
  loading: boolean;
  selectedProduct: any;
  settings: ThemeSettings;
  onSaveSettings: (settings: ThemeSettings) => void;
  onBack: () => void;
}

const ChatBody: React.FC<ChatBodyProps> = ({
  currentView,
  isNewChat,
  chatHistory,
  loading,
  selectedProduct,
  settings,
  onSaveSettings,
  onBack,
}) => {
  return (
    <div className="bb-sm-chat-body flex-grow overflow-y-auto">
      {currentView === "store" && <StoreView />}
      {currentView === "product" && (
        <ProductDetailView product={selectedProduct} />
      )}
      {currentView === "settings" && (
        <SettingsPage
          onClose={onBack}
          onSave={onSaveSettings}
          initialSettings={settings}
        />
      )}
      {currentView === "chat" && (
        <>
          {isNewChat ? (
            <NewChatView />
          ) : (
            <ChatHistory chatHistory={chatHistory} loading={loading} />
          )}
        </>
      )}
    </div>
  );
};

export default ChatBody;
