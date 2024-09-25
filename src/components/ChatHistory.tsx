import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import loadingIcon from "/images/loading-spinner-white.gif";
import { FaThumbsUp, FaThumbsDown, FaRedo, FaCopy } from "react-icons/fa";

interface ChatHistoryProps {
  chatHistory: { role: string; content: string; id: string }[];
  loading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
  onFeedback: (index: number, feedbackType: "like" | "dislike") => void;
  onRetry: (index: number) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatHistory,
  loading,
  chatEndRef,
  onFeedback,
  onRetry,
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState<{
    [key: string]: "like" | "dislike" | null;
  }>({});

  const handleFeedback = (index: number, feedbackType: "like" | "dislike") => {
    onFeedback(index, feedbackType);
    setFeedbackGiven((prev) => ({ ...prev, [index]: feedbackType }));
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      console.log("Text copied to clipboard");
    });
  };

  return (
    <div className="bb-sm-chat-messages flex-1 overflow-y-auto mb-2">
      {chatHistory?.map((chat, index) => {
        const isBot = chat.role === "assistant";
        const isLoading = loading && isBot && index === chatHistory.length - 1;
        const messageClass = isBot ? "bb-sm-bot-message" : "bb-sm-user-message";

        return (
          <div
            className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}
            key={`chat-message-${index}`}
          >
            <div
              className={`bb-sm-message-container ${
                isBot ? "bb-sm-bot-container" : ""
              }`}
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
                  <ReactMarkdown className="text-sm md:text-base bb-sm-prose bb-sm-prose-invert">
                    {chat.content}
                  </ReactMarkdown>
                )}
              </div>
              {isBot && !isLoading && (
                <div className="bb-sm-feedback-buttons">
                  <div className="bb-sm-left-buttons">
                    <button
                      onClick={() => handleCopy(chat.content)}
                      className="bb-sm-feedback-button text-xs flex items-center gap-1"
                    >
                      <FaCopy size={12} />
                      Copy
                    </button>
                  </div>
                  <div className="bb-sm-right-buttons">
                    <button
                      onClick={() => onRetry(index)}
                      className="bb-sm-feedback-button"
                    >
                      <FaRedo size={12} />
                    </button>
                    <button
                      onClick={() => handleFeedback(index, "like")}
                      className={`bb-sm-feedback-button ${
                        feedbackGiven[index] === "like"
                          ? "bb-sm-feedback-given"
                          : ""
                      }`}
                      disabled={feedbackGiven[index] === null}
                    >
                      <FaThumbsUp size={12} />
                    </button>
                    <button
                      onClick={() => handleFeedback(index, "dislike")}
                      className={`bb-sm-feedback-button ${
                        feedbackGiven[index] === "dislike"
                          ? "bb-sm-feedback-given"
                          : ""
                      }`}
                      disabled={feedbackGiven[index] === null}
                    >
                      <FaThumbsDown size={12} />
                    </button>
                  </div>
                </div>
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
