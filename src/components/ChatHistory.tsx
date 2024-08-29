import React from "react";
import ReactMarkdown from "react-markdown";

interface ChatHistoryProps {
  chatHistory: { role: string; content: string }[];
  loading: boolean;
  userPhoto: string;
  botIcon: string;
  loadingIcon: string;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatHistory,
  loading,
  userPhoto,
  botIcon,
  loadingIcon,
  chatEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto mb-2">
      {chatHistory?.map((chat, index) => {
        const isBot = chat.role === "assistant";
        const isLoading = loading && isBot && index === chatHistory.length - 1;
        const iconSrc = isBot ? botIcon : userPhoto;
        const bgColorClass = isBot ? "vibrant-green-background" : "medium-gray";
        const altText = isBot ? "Bot Icon" : "User Icon";

        return (
          <div
            className={`flex gap-2 mb-4 ${
              isBot ? "justify-start" : "justify-end"
            } items-center`}
            key={`chat-message-${index}`}
          >
            {isBot && (
              <img
                src={iconSrc}
                className="w-8 h-8 rounded-full md:w-10 md:h-10"
                alt={altText}
              />
            )}
            <div
              className={`${bgColorClass} rounded-md py-2 px-4 max-w-[70%] shadow-md`}
            >
              {isLoading ? (
                <img src={loadingIcon} className="w-6 h-6" alt="Loading" />
              ) : (
                <ReactMarkdown className="text-white text-base md:text-lg prose prose-invert">
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
