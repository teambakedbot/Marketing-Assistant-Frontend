import React from "react";
import ReactMarkdown from "react-markdown";
import loadingIcon from "/images/loading-spinner-white.gif";

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
        const messageClass = isBot ? "bb-sm-bot-message" : "bb-sm-user-message";

        return (
          <div
            className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}
            key={`chat-message-${index}`}
          >
            <div className={`bb-sm-message ${messageClass}`}>
              {isLoading ? (
                <div className="bb-sm-loading-dots">
                  <img
                    src={loadingIcon}
                    className="w-5 h-5 bb-sm-loading-icon"
                    alt="Loading"
                  />
                </div>
              ) : (
                <ReactMarkdown className="text-white text-sm md:text-base bb-sm-prose bb-sm-prose-invert">
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
