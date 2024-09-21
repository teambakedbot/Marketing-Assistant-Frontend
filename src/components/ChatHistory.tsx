import React from "react";
import ReactMarkdown from "react-markdown";

interface ChatHistoryProps {
  chatHistory: { role: string; content: string }[];
  loading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatHistory,
  loading,
  chatEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto mb-2">
      {chatHistory?.map((chat, index) => {
        const isBot = chat.role === "assistant";
        const isLoading = loading && isBot && index === chatHistory.length - 1;
        const messageClass = isBot ? "bot-message" : "user-message";

        return (
          <div
            className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}
            key={`chat-message-${index}`}
          >
            <div className={`message ${messageClass}`}>
              {isLoading ? (
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                <ReactMarkdown className="text-white text-sm md:text-base prose prose-invert">
                  {chat.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        );
      })}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatHistory;
