import React from "react";
import { FaEllipsisV, FaCheck } from "react-icons/fa";
import LoginForm from "./LoginForm";
import robotIcon from "/images/pointing.png"; // Import the robot icon
import notLoggedInIcon from "/images/blunt-smokey.png"; // Import the not logged in icon

// Define the props for the Sidebar component
interface SidebarProps {
  isMenuOpen: boolean;
  isLoggedIn: boolean;
  chats: Array<{ chat_id: string; name: string }>;
  activeChatId: string | null;
  onLoadChatHistory: (chatId: string | null) => void;
  onLogin: () => void;
  onViewSettings: () => void;
  onViewStore: () => void;
  onRenameChat: (chatId: string, newName: string) => void;
  onDeleteChat: (chatId: string) => void;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<any>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMenuOpen,
  isLoggedIn,
  chats,
  activeChatId,
  onLoadChatHistory,
  onLogin,
  onViewSettings,
  onViewStore,
  onRenameChat,
  onDeleteChat,
  setIsMenuOpen,
}) => {
  const [editingChatId, setEditingChatId] = React.useState<string | null>(null);
  const [newChatName, setNewChatName] = React.useState("");
  const renameInputRef = React.useRef<HTMLInputElement>(null);
  const renameContainerRef = React.useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
    chatId: string;
  } | null>(null);

  // Focus the input when a chat is being renamed
  React.useEffect(() => {
    if (editingChatId && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [editingChatId]);

  // Add click outside handling for the rename container
  React.useEffect(() => {
    if (!editingChatId) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        renameContainerRef.current &&
        !renameContainerRef.current.contains(e.target as Node)
      ) {
        setEditingChatId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingChatId]);

  const handleSaveRename = () => {
    if (editingChatId) {
      console.log("Saving new chat name:", newChatName);
      onRenameChat(editingChatId, newChatName);
    }
    setEditingChatId(null);
  };

  const handleContextMenu = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, chatId });
  };

  const handleOutsideClick = React.useCallback((e: MouseEvent) => {
    const contextMenuElement = document.querySelector(".bb-sm-context-menu");
    if (contextMenuElement && !contextMenuElement.contains(e.target as Node)) {
      setContextMenu(null);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <div className={`bb-sm-side-menu ${isMenuOpen ? "bb-sm-open" : ""}`}>
      <div className="bb-sm-side-menu-header">
        <button
          className="ml-auto font-semibold"
          onClick={() => setIsMenuOpen(false)}
        >
          X
        </button>
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
                    <div
                      className="bb-sm-chat-rename-input flex items-center"
                      ref={renameContainerRef}
                    >
                      <input
                        ref={renameInputRef}
                        type="text"
                        className="text-sm h-10 flex-1"
                        value={newChatName}
                        onChange={(e) => setNewChatName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveRename();
                          if (e.key === "Escape") setEditingChatId(null);
                        }}
                      />
                      <button
                        onClick={handleSaveRename}
                        className="ml-2 text-primary-color"
                      >
                        <FaCheck size={16} />
                      </button>
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
                        onClick={(e) => handleContextMenu(e, chat_id)}
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

      {contextMenu && (
        <div
          className="bb-sm-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => {
              // Set rename mode and populate with current name.
              const chat = chats.find((c) => c.chat_id === contextMenu.chatId);
              if (chat) {
                setNewChatName(chat.name);
                setEditingChatId(chat.chat_id);
              }
              setContextMenu(null);
            }}
          >
            Rename
          </button>
          <button
            onClick={() => {
              onDeleteChat(contextMenu.chatId);
              setContextMenu(null);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
