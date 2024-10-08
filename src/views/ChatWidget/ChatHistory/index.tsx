import React from "react";

interface ChatHistoryProps {
  chatHistory: { role: string; content: string }[];
  loading: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory, loading }) => {
  return (
    <div className="bb-sm-chat-messages">
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`bb-sm-message ${
            message.role === "user" ? "bb-sm-user-message" : "bb-sm-bot-message"
          }`}
        >
          {message.content}
        </div>
      ))}
      {loading && (
        <div className="bb-sm-loading-container">
          <div className="bb-sm-spinner">
            <div className="bb-sm-bounce1"></div>
            <div className="bb-sm-bounce2"></div>
            <div className="bb-sm-bounce3"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
