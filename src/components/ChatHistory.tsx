import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import loadingIcon from "/images/loading-spinner-white.gif";
import { FaThumbsUp, FaThumbsDown, FaRedo, FaCopy } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { Product } from "../views/ChatWidget/api/renameChat";

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
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatHistory,
  loading,
  chatEndRef,
  onFeedback,
  onRetry,
  onAddToCart,
  cart,
  allowCart,
  updateQuantity,
}) => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<{
    [key: string]: "like" | "dislike" | null;
  }>({});

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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="bb-sm-chat-messages flex-1 overflow-y-auto mb-2"
      ref={chatContainerRef}
    >
      {chatHistory?.map((message, index) => {
        const isBot = message.type === "ai" || message.role === "ai";
        const isLoading = loading && isBot && index === chatHistory.length - 1;
        const messageClass = isBot ? "bb-sm-bot-message" : "bb-sm-user-message";
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
                  <>
                    <ReactMarkdown className="text-sm md:text-base bb-sm-prose bb-sm-prose-invert">
                      {message.content}
                    </ReactMarkdown>
                    {message.data && message.data.products && (
                      <div className="bb-sm-product-grid mt-4">
                        {message.data.products.map(
                          (product: Product, productIndex: number) => (
                            <ProductCard
                              allowCart={allowCart}
                              key={`${product.product_name}-${productIndex}`}
                              product={product}
                              cart={cart}
                              updateQuantity={updateQuantity}
                              onAddToCart={onAddToCart}
                            />
                          )
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
              {index > 0 && isBot && !isLoading && (
                <div className="bb-sm-feedback-buttons">
                  <div className="bb-sm-left-buttons">
                    {/* <button
                      onClick={() => handleCopy(message.content)}
                      className="bb-sm-feedback-button text-xs flex items-center gap-1"
                    >
                      <FaCopy size={12} />
                      Copy
                    </button> */}
                  </div>
                  <div className="bb-sm-right-buttons">
                    {/* <button
                      onClick={() => onRetry(message.message_id)}
                      className="bb-sm-feedback-button"
                    >
                      <FaRedo size={12} />
                    </button> */}
                    <button
                      onClick={() => handleFeedback(message.message_id, "like")}
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
      {/* {!isAtBottom && (
        <button className="bb-sm-scroll-to-bottom" onClick={scrollToBottom}>
          ↓
        </button>
      )} */}
    </div>
  );
};

export default ChatHistory;
