import React from "react";
import ReactMarkdown from "react-markdown";

interface ChatHistoryProps {
  chatHistory: { sender: string; message: string }[];
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
      {chatHistory.map((chat, index) => {
        const isReceiver = chat.sender === "bot";
        const isLoading =
          loading && isReceiver && index === chatHistory.length - 1;
        const iconSrc = isReceiver ? botIcon : userPhoto;
        const bgColor = isReceiver ? "bg-[#22AD89]" : "bg-[#23504A]";
        const altText = isReceiver ? "Bot Icon" : "User Icon";

        return (
          <div className="flex gap-2 mb-4" key={`chat-message-${index}`}>
            <img
              src={iconSrc}
              className="w-8 h-8 rounded-full md:w-10 md:h-10"
              alt={altText}
            />
            <div className={`${bgColor} rounded-md py-2 px-4`}>
              {isLoading ? (
                <p className="text-white text-base md:text-lg">
                  <img src={loadingIcon} className="w-6 h-6" alt="Loading" />
                </p>
              ) : (
                <p className="text-white text-base md:text-lg">
                  <ReactMarkdown>{chat.message}</ReactMarkdown>
                </p>
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
