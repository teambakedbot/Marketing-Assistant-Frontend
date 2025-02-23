import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import loadingIcon from "/images/loading-spinner-white.gif";
import { FaThumbsUp, FaThumbsDown, FaRedo, FaCopy } from "react-icons/fa";
import ProductCard from "../../components/ProductCard";
import { Product } from "./api/renameChat";
import RetailerCard from "../../components/RetailerCard";

interface ChatHistoryProps {
  chatHistory: any[];
  loading: boolean;
  cart: { [key: string]: { quantity: number } };
  updateQuantity: (productId: string, quantity: number) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
  onFeedback: (message_id: string, feedbackType: "like" | "dislike") => void;
  onRetry: (message_id: string) => void;
  onAddToCart: (product: Product) => void;
  allowCart?: boolean;
  onProductClick?: (product: Product) => void;
  onDeleteMessage?: (message_id: string) => void;
  onSuggestedQuestionClick?: (question: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatHistory,
  loading,
  chatEndRef,
  onFeedback,
  onRetry,
  onAddToCart,
  cart,
  allowCart = false,
  updateQuantity,
  onProductClick,
  onDeleteMessage,
  onSuggestedQuestionClick,
}) => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<{
    [key: string]: "like" | "dislike" | null;
  }>({});
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const handleFeedback = (
    message_id: string,
    feedbackType: "like" | "dislike"
  ) => {
    onFeedback(message_id, feedbackType);
    setFeedbackGiven((prev) => ({ ...prev, [message_id]: feedbackType }));
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      console.log("Text copied to clipboard");
    });
  };

  const checkIfAtBottom = useCallback(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const newIsAtBottom =
        Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
      setIsAtBottom(newIsAtBottom);
    }
  }, []);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", checkIfAtBottom);
      return () => chatContainer.removeEventListener("scroll", checkIfAtBottom);
    }
  }, [checkIfAtBottom]);

  useEffect(() => {
    checkIfAtBottom();
  }, [chatHistory, checkIfAtBottom]);

  useEffect(() => {
    // Update suggested questions when chat history changes
    if (chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      if (lastMessage.data?.suggested_next_questions) {
        setSuggestedQuestions(lastMessage.data.suggested_next_questions);
      } else {
        setSuggestedQuestions([]);
      }
    }
  }, [chatHistory]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderMessageContent = (message: any) => {
    if (message.error) {
      return (
        <div className="bb-sm-error-message">
          <p>{message.content}</p>
          <button
            onClick={() => onRetry(message.message_id)}
            className="bb-sm-retry-button flex items-center gap-1"
          >
            <FaRedo size={12} /> Retry
          </button>
        </div>
      );
    }

    return (
      <>
        {message.content && (
          <div className="bb-sm-message-text">
            <ReactMarkdown className="bb-sm-prose-invert">
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {message.data && (
          <div className="bb-sm-message-data">
            {/* Handle images */}
            {message.data.images && message.data.images.length > 0 && (
              <div className="bb-sm-images-grid grid grid-cols-2 gap-4 mt-2">
                {message.data.images.map((image: any, index: number) => (
                  <img
                    key={`${image.url}-${index}`}
                    src={image.url}
                    alt={image.prompt || "Generated image"}
                    className="w-full h-auto rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Handle products */}
            {message.data.products && message.data.products.length > 0 && (
              <div className="bb-sm-products-grid grid grid-cols-2 gap-4 mt-2">
                {message.data.products.map((product: any, index: number) => (
                  <ProductCard
                    allowCart={allowCart}
                    key={`${product.product_name}-${index}`}
                    product={product}
                    cart={cart}
                    updateQuantity={updateQuantity}
                    onAddToCart={onAddToCart}
                    onProductClick={onProductClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="bb-sm-chat-messages flex-1 overflow-y-auto"
        ref={chatContainerRef}
      >
        {chatHistory?.map((message, index) => {
          const isBot = message.type === "ai" || message.role === "ai";
          const isLoading =
            loading && isBot && index === chatHistory.length - 1;
          const messageClass = isBot
            ? "bb-sm-bot-message"
            : "bb-sm-user-message";

          return (
            <div
              className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}
              key={index}
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
                    renderMessageContent(message)
                  )}
                </div>
                {index > 0 && isBot && !isLoading && !message.error && (
                  <div className="bb-sm-feedback-buttons">
                    <div className="bb-sm-right-buttons">
                      <button
                        onClick={() =>
                          handleFeedback(message.message_id, "like")
                        }
                        className={`bb-sm-feedback-button ${
                          feedbackGiven[message.message_id] === "like"
                            ? "bb-sm-feedback-given"
                            : ""
                        }`}
                        disabled={feedbackGiven[message.message_id] === null}
                      >
                        <FaThumbsUp size={12} />
                      </button>
                      <button
                        onClick={() =>
                          handleFeedback(message.message_id, "dislike")
                        }
                        className={`bb-sm-feedback-button ${
                          feedbackGiven[message.message_id] === "dislike"
                            ? "bb-sm-feedback-given"
                            : ""
                        }`}
                        disabled={feedbackGiven[message.message_id] === null}
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
    </div>
  );
};

export default ChatHistory;
