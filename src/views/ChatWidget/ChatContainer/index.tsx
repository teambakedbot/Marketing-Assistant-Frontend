import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

interface ChatInputProps {
  currentView: "chat" | "store" | "product" | "settings";
  onSendMessage: (message: string) => void;
  onSearch: (query: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  currentView,
  onSendMessage,
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView === "chat") {
      onSendMessage(inputValue);
    } else if (currentView === "store") {
      onSearch(inputValue);
    }
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="bb-sm-chat-input">
      <textarea
        className="resize-none w-full placeholder-gray-400 bg-transparent text-white p-2 min-h-[40px] max-h-[120px] overflow-y-auto"
        placeholder={
          currentView === "chat" ? "Ask me anything..." : "Search here..."
        }
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit" className="bb-sm-send-button">
        <FaPaperPlane />
      </button>
    </form>
  );
};

export default ChatInput;
