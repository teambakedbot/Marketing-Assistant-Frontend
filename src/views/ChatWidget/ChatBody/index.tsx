import React from "react";
import StoreView from "../StoreView/index.tsx";
import ProductDetailView from "../ProductDetailView/index.tsx";
import SettingsPage from "../SettingsPage/index.tsx";
import ChatHistory from "../ChatHistory/index.tsx";
import NewChatView from "../NewChatView/index.tsx";
import { ThemeSettings } from "../settings";
import { Product } from "../api/renameChat";

interface ChatBodyProps {
  currentView: "chat" | "store" | "product" | "settings";
  isNewChat: boolean;
  chatHistory: { type: string; content: string }[];
  loading: boolean;
  selectedProduct: any;
  settings: ThemeSettings;
  onSaveSettings: (settings: ThemeSettings) => void;
  onBack: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
  cart: { [key: string]: { quantity: number } };
  updateQuantity: (productId: string, quantity: number) => void;
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
  products,
  onAddToCart,
  cart,
  updateQuantity,
}) => {
  return (
    <div className="bb-sm-chat-body flex-grow overflow-y-auto">
      {currentView === "store" && (
        <StoreView
          products={products}
          onAddToCart={onAddToCart}
          cart={cart}
          updateQuantity={updateQuantity}
        />
      )}
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
