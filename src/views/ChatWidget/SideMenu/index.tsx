import React from "react";
import { FaPlus, FaStore, FaCog } from "react-icons/fa";

interface SideMenuProps {
  isOpen: boolean;
  chats: any[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onViewSettings: () => void;
  onViewStore: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  chats,
  activeChatId,
  onChatSelect,
  onNewChat,
  onViewSettings,
  onViewStore,
}) => {
  return (
    <div className={`bb-sm-side-menu ${isOpen ? "bb-sm-open" : ""}`}>
      <div className="bb-sm-side-menu-header">
        <button className="bb-sm-menu-item" onClick={onNewChat}>
          <FaPlus className="mr-2" /> New Chat
        </button>
      </div>
      <div className="bb-sm-side-menu-content">
        <div className="bb-sm-chat-history-scroll">
          {chats.map((chat) => (
            <button
              key={chat.id}
              className={`bb-sm-menu-item ${
                chat.id === activeChatId ? "bb-sm-active" : ""
              }`}
              onClick={() => onChatSelect(chat.id)}
            >
              {chat.name}
            </button>
          ))}
        </div>
      </div>
      <div className="bb-sm-side-menu-footer">
        <button className="bb-sm-menu-item" onClick={onViewStore}>
          <FaStore className="mr-2" /> View Store
        </button>
        <button className="bb-sm-menu-item" onClick={onViewSettings}>
          <FaCog className="mr-2" /> Settings
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
