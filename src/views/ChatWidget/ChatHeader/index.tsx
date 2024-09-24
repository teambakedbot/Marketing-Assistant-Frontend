import React from "react";
import { FaStore } from "react-icons/fa";

interface ChatHeaderProps {
  currentView: "chat" | "store" | "product" | "settings";
  isMenuOpen: boolean;
  toggleMenu: () => void;
  onClose: () => void;
  onViewStore: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentView,
  isMenuOpen,
  toggleMenu,
  onClose,
  onViewStore,
}) => {
  return (
    <div className="bb-sm-chat-header">
      <div className="flex flex-row gap-5 w-15">
        <button
          className={`bb-sm-hamburger-menu ${
            isMenuOpen || currentView !== "chat" ? "bb-sm-open" : ""
          }`}
          onClick={toggleMenu}
        >
          <div></div>
          <div></div>
          <div></div>
        </button>
        <div className="w-5"> </div>
      </div>
      <p className="text-lg md:text-xl font-bold text-center">
        {currentView === "store" ? "Store" : "Chat"}
      </p>
      <div className="flex flex-row gap-5 w-15 justify-end">
        <button className="" onClick={onViewStore}>
          <FaStore size={20} />
        </button>
        <button className="bb-sm-close-button" onClick={onClose}></button>
      </div>
    </div>
  );
};

export default ChatHeader;
