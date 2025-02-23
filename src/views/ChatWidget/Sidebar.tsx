import React from "react";
import { FaEllipsisV } from "react-icons/fa";
import LoginForm from "./LoginForm";
import robotIcon from "/images/pointing.png"; // Import the robot icon
import notLoggedInIcon from "/images/blunt-smokey.png"; // Import the not logged in icon

// Define the props for the Sidebar component
interface SidebarProps {
  isMenuOpen: boolean;
  isLoggedIn: boolean;
  chats: Array<{ chat_id: string; name: string }>;
  activeChatId: string | null;
  editingChatId: string | null;
  newChatName: string;
  onLoadChatHistory: (chatId: string | null) => void;
  onLogin: () => void;
  onViewSettings: () => void;
  onViewStore: () => void;
  onRenameChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onContextMenu: (e: React.MouseEvent, chatId: string) => void;
  onSaveRename: () => void;
  onNewChatName: (name: string) => void;
  onCancelRename: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMenuOpen,
  isLoggedIn,
  chats,
  activeChatId,
  editingChatId,
  newChatName,
  onLoadChatHistory,
  onLogin,
  onViewSettings,
  onViewStore,
  onRenameChat,
  onDeleteChat,
  onContextMenu,
  onSaveRename,
  onNewChatName,
  onCancelRename,
}) => {
  const renameInputRef = React.useRef<HTMLInputElement>(null);

  const handleSaveRename = () => {
    if (!editingChatId || !newChatName.trim()) return;
    onRenameChat(editingChatId);
    onSaveRename();
  };

  const handleContextMenu = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    onContextMenu(e, chatId);
  };

  return (
    <div className={`bb-sm-side-menu ${isMenuOpen ? "bb-sm-open" : ""}`}>
      <div className="bb-sm-side-menu-header">
        <div className="bb-sm-robot-icon-container">
          <img
            src={isLoggedIn ? robotIcon : notLoggedInIcon}
            alt={isLoggedIn ? "Chat Bot" : "Not Logged In"}
            className="bb-sm-robot-icon"
          />
        </div>
        {isLoggedIn && (
          <h2 className="bb-sm-chat-history-title">Chat history</h2>
        )}
        <button
          className="bb-sm-settings-button"
          onClick={() => onLoadChatHistory(null)}
        >
          New Chat
        </button>
      </div>

      <div className="bb-sm-side-menu-content">
        {isLoggedIn ? (
          <div className="bb-sm-chat-history-scroll">
            {chats.length > 0 ? (
              chats.map(({ chat_id, name }: any, index) => (
                <div
                  key={`${chat_id}-${index}`}
                  className="bb-sm-chat-item-container"
                >
                  {editingChatId === chat_id ? (
                    <div className="bb-sm-chat-rename-input">
                      <input
                        ref={renameInputRef}
                        type="text"
                        className="text-sm h-10"
                        value={newChatName}
                        onChange={(e) => onNewChatName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onSaveRename();
                          if (e.key === "Escape") onCancelRename();
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="bb-sm-chat-item-wrapper">
                      <button
                        onClick={() => onLoadChatHistory(chat_id)}
                        className={`bb-sm-menu-item text-md ${
                          activeChatId === chat_id ? "bb-sm-active" : ""
                        }`}
                      >
                        {name}
                      </button>
                      <button
                        className="bb-sm-chat-options-button"
                        onClick={(e) => {
                          handleContextMenu(e, chat_id);
                        }}
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <FaEllipsisV className="text-secondary-color" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No conversations yet.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <h2 className="text-2xl font-bold mb-6">Login to Chat</h2>
            <LoginForm onLogin={onLogin} />
          </div>
        )}
      </div>

      {isLoggedIn && (
        <div className="bb-sm-side-menu-footer flex flex-row gap-2 mb-2">
          <button className="bb-sm-settings-button" onClick={onViewSettings}>
            Settings
          </button>
          <button className="bb-sm-settings-button" onClick={onViewStore}>
            Shop
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
