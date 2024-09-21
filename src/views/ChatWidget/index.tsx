import React, { useEffect, useRef, useState, useCallback } from "react";
import bottom from "/images/Chatbot logo white background large-circle.png";
import botIcon from "/images/receiver.jpeg";
import product1 from "/images/product1.png";
import sendIcon from "/images/send.png";
import axios from "axios";
import loadingIcon from "/images/loading-spinner-white.gif";
import Swal from "sweetalert2";
import ChatHistory from "../../components/ChatHistory";
import "./main.css";
import useAuth from "../../hooks/useAuth";
import { Chats } from "../../models/ChatModels";
import { getChats, getChatMessages, sendMessage } from "../../utils/api";
import robotIcon from "/images/pointing.png"; // Import the robot icon

export const ChatWidget: React.FC = () => {
  const { displayName, photoURL, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [prompts, setPrompts] = useState<string>("");
  const [chats, setChats] = useState<Chats[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([{ role: "assistant", content: "Hey, how can I help?" }]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchChatMessages = useCallback(async () => {
    if (!currentChatId || chatHistory.length > 0) return;
    try {
      const token = await user!.getIdToken();
      const messages = await getChatMessages(token, currentChatId);
      setChatHistory(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  }, [currentChatId, user, chatHistory]);

  const fetchUserChats = useCallback(async () => {
    try {
      const token = await user!.getIdToken();
      const fetchedChats = await getChats(token);
      if (fetchedChats.length > 0) {
        setChats(fetchedChats);
      }
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  }, [user]);
  useEffect(() => {
    if (user) {
      fetchUserChats();
    }
  }, [user]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.valueAsNumber);
  };

  const handleModalBox = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const playHandler = async () => {
    if (!prompts || loading) return;
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: prompts },
      { role: "assistant", content: "loading" },
    ]);
    setPrompts("");
    setLoading(true);
    try {
      const token = await user!.getIdToken();
      const response = await sendMessage(
        token,
        prompts,
        "voiceType",
        currentChatId
      );
      setChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        updatedHistory[updatedHistory.length - 1].content = response.response;
        return updatedHistory;
      });
      if (response.chat_id) {
        setCurrentChatId(response.chat_id);
        fetchUserChats();
      }
    } catch (error: any) {
      Swal.fire({
        title: "Fetching Chat Answer",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const userPhoto = photoURL || "/images/person-image.png";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    fetchChatMessages();
  }, [chatHistory, loading, fetchChatMessages]);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <div className="chat-widget">
      <button className="border-none outline-0" onClick={handleModalBox}>
        <img src={bottom} className="w-10" alt="Open Chatbot" />
      </button>
      {isModalOpen && (
        <div className="absolute right-2 bottom-14 flex justify-center items-center z-50 animate-open">
          <div className="chat-container p-3 pb-0 md:p-3 rounded-lg shadow-lg relative">
            <div className="md:flex md:flex-row flex-col gap-3 min-h-[450px] lg:min-h-[550px] lg:min-w-[800px]">
              {/* Chat area */}
              <div className="h-full w-full md:w-3/4 relative rounded-md p-2 flex flex-col gap-2 overflow-hidden">
                <div className="chat-header">
                  <button
                    className={`hamburger-menu ${isMenuOpen ? "open" : ""}`}
                    onClick={toggleMenu}
                  >
                    <div></div>
                    <div></div>
                    <div></div>
                  </button>
                  <p className="text-lg md:text-xl font-bold">Chat</p>
                  <div className="w-6"></div> {/* Placeholder for balance */}
                </div>
                <div className="chat-messages flex-grow overflow-y-auto">
                  <ChatHistory
                    chatHistory={chatHistory}
                    loading={loading}
                    chatEndRef={chatEndRef}
                  />
                </div>
                <div className="chat-input">
                  <textarea
                    className="resize-none w-full placeholder-gray-400"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        playHandler();
                      }
                    }}
                    placeholder="Type your message..."
                    value={prompts}
                    onChange={(e) => {
                      setPrompts(e.target.value);
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                    rows={1}
                    style={{
                      overflowY: "auto",
                      padding: "8px",
                      maxHeight: "4.5em",
                    }}
                  />

                  <button onClick={playHandler} disabled={loading}>
                    {loading ? (
                      <img
                        src={loadingIcon}
                        className="w-5 h-5"
                        alt="Loading"
                      />
                    ) : (
                      <img src={sendIcon} className="w-5 h-5" alt="Send" />
                    )}
                  </button>
                </div>
              </div>

              {/* Side menu */}
              <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
                <div className="side-menu-header">
                  <button className="back-button">
                    <svg /* Add your back arrow SVG here */ />
                  </button>
                  <img src={robotIcon} alt="Chat Bot" className="robot-icon" />
                  <button className="edit-button">
                    <svg /* Add your edit/pencil SVG here */ />
                  </button>
                </div>
                <h2 className="chat-history-title">Chat history</h2>
                <div className="side-menu-content">
                  <button className="menu-item active">
                    Demo: Image/Video/Audio
                  </button>
                  <button className="menu-item">
                    Demo: polls/Quizzes/Actions
                  </button>
                  <button className="menu-item">Demo: Purchase Flow</button>
                  <button className="menu-item">Demo: Advice Flow</button>
                </div>
                <div className="side-menu-footer">
                  <h3>Featured products</h3>
                  <div className="featured-product">
                    {/* Add your featured product image here */}
                  </div>
                  <button className="settings-button">Settings</button>
                </div>
              </div>

              {/* Right panel */}
              <div className="h-full w-full md:w-1/4 rounded-md p-2 flex flex-col justify-between gap-2 right-panel">
                <div className="panel-container product-info">
                  <h3>Purple Punch I</h3>
                  <p>A premium cannabis strain</p>
                  <img
                    src={product1}
                    alt="Product Viewer"
                    className="w-full object-contain h-[100px] md:h-[150px]"
                  />{" "}
                </div>
                <div className="panel-container desired-effects">
                  <h4>Desired Effect:</h4>
                  <div className="effects-icons">
                    <label
                      htmlFor="slider"
                      className="block text-white font-bold text-base md:text-lg mb-2"
                    >
                      Desired Effect:
                    </label>
                    <input
                      type="range"
                      id="slider"
                      min="0"
                      max="4"
                      value={value}
                      onChange={handleChange}
                      className="w-full h-1 bg-dark-green-background-1 rounded-lg appearance-none border-0 outline-0 cursor-pointer accent-dark-green-background-3"
                      style={{
                        WebkitAppearance: "none",
                        appearance: "none",
                      }}
                    />
                    <div className="flex justify-between gap-1 text-sm text-gray-300 mt-4">
                      <span className="text-2xl text-center md:leading-[8px] tracking-tighter">
                        😴
                      </span>
                      <span className="text-2xl text-center md:leading-[8px] tracking-tighter">
                        🧘
                      </span>
                      <span className="text-2xl text-center md:leading-[8px] tracking-tighter">
                        🤗
                      </span>
                      <span className="text-2xl text-center md:leading-[8px] tracking-tighter">
                        💡
                      </span>
                      <span className="text-2xl text-center md:leading-[8px] tracking-tighter">
                        🚀
                      </span>
                    </div>
                  </div>
                </div>
                <div className="panel-container community-reviews">
                  <h4>Community Reviews</h4>
                  <p>See what others are saying</p>
                  <div className="reviews-list">
                    {/* Add sample reviews here */}
                    <div className="review">Sample review 1</div>
                    <div className="review">Sample review 2</div>
                    <div className="review">Sample review 3</div>
                    {/* Add more sample reviews as needed */}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-white mt-4 text-md">Powered by BakedBot AI</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
