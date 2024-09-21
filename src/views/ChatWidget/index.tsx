import React, { useEffect, useRef, useState, useCallback } from "react";
import bottom from "/images/Chatbot logo white background large-circle.png";
import botIcon from "/images/receiver.jpeg";
import product1 from "/images/product1.png";
import product2 from "/images/product2.png";
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
import notLoggedInIcon from "/images/security.png"; // Import the not logged in icon
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../config/firebase-config";

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
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const loadChatHistory = useCallback(
    async (chatId: string | null) => {
      if (chatId === null) {
        setActiveChatId(null);
        setCurrentChatId(null);
        setChatHistory([
          { role: "assistant", content: "Hey, how can I help?" },
        ]);
      } else {
        setActiveChatId(chatId);
        setCurrentChatId(chatId);
        try {
          const token = await user!.getIdToken();
          const messages = await getChatMessages(token, chatId);
          setChatHistory(messages);
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      fetchUserChats();
    } else {
      setIsLoggedIn(false);
    }
  }, [user, fetchUserChats]);

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
        setActiveChatId(response.chat_id);
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

  const LoginForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        // Implement your email/password login logic here
        onLogin();
      } catch (error) {
        console.error("Error signing in:", error);
      }
    };

    const handleGoogleSignIn = async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        onLogin();
      } catch (error) {
        console.error("Error signing in with Google:", error);
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="login-form flex flex-col gap-6 w-full max-w-md"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="login-input p-3 rounded bg-gray-700 text-white text-lg"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input p-3 rounded bg-gray-700 text-white text-lg"
        />
        <button
          type="submit"
          className="login-button border-2 border-white rounded-md text-white p-3 text-lg hover:bg-white hover:text-gray-800 transition-colors"
        >
          Login
        </button>
        <div className="text-center text-white my-4 text-lg">or</div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="google-login-button border-2 border-white rounded-md text-white p-3 text-lg flex items-center justify-center hover:bg-white hover:text-gray-800 transition-colors"
        >
          <img
            src="/images/google-icon.png"
            alt="Google"
            className="w-6 h-6 mr-2"
          />
          Login with Google
        </button>
      </form>
    );
  };

  return (
    <div className="chat-widget">
      <button className="border-none outline-0" onClick={handleModalBox}>
        <img src={bottom} className="w-10" alt="Open Chatbot" />
      </button>
      {isModalOpen && (
        <div className="absolute right-2 bottom-14 flex justify-center items-center z-50 animate-open">
          <div className="chat-container p-3 pb-0 md:p-3 rounded-lg shadow-lg relative">
            <div className="md:flex md:flex-row flex-col gap-3 min-h-[450px] lg:min-h-[550px] lg:min-w-[500px]">
              {/* Chat area */}
              <div className="h-full w-full md:w-4/4 relative rounded-md p-2 flex flex-col gap-2 overflow-hidden">
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
                  <div className="robot-icon-container">
                    <img
                      src={isLoggedIn ? robotIcon : notLoggedInIcon}
                      alt={isLoggedIn ? "Chat Bot" : "Not Logged In"}
                      className="robot-icon"
                    />
                  </div>
                  {isLoggedIn && (
                    <h2 className="chat-history-title">Chat history</h2>
                  )}
                  <button
                    className="settings-button"
                    onClick={() => loadChatHistory(null)}
                  >
                    New Chat
                  </button>
                </div>

                <div className="side-menu-content">
                  {isLoggedIn ? (
                    <div className="chat-history-scroll">
                      {chats.length > 0 ? (
                        chats.map(({ chat_id, name }: any, index) => (
                          <button
                            key={`${chat_id}-${index}`}
                            onClick={() => loadChatHistory(chat_id)}
                            className={`menu-item text-md ${
                              activeChatId === chat_id ? "active" : ""
                            }`}
                          >
                            {name}
                          </button>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          No conversations yet.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full w-full p-4">
                      <h2 className="text-2xl font-bold mb-6 text-white">
                        Login to Chat
                      </h2>
                      <LoginForm onLogin={() => setIsLoggedIn(true)} />
                    </div>
                  )}
                </div>

                {/* {isLoggedIn && (
                  <div className="side-menu-footer">
                    <button className="settings-button">Settings</button>
                  </div>
                )} */}
              </div>

              {/* Right panel */}
              <div className="h-full w-full md:w-1/3 rounded-md p-2 flex flex-col justify-between gap-1 right-panel">
                <div className="panel-container product-info">
                  <h3 className="text-center">Purple Punch I</h3>
                  <p className="text-center text-sm">
                    A premium cannabis strain
                  </p>
                  <img
                    src={
                      "https://images.weedmaps.com/pictures/listings/159/608/069/425191536_nug0454.jpg"
                    }
                    alt="Product Viewer"
                    className="w-full object-contain h-[100px] md:h-[150px]"
                  />
                </div>
                <div className="panel-container desired-effects">
                  <h4>Desired Effect:</h4>
                  <div className="effects-icons">
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
                  <h4 className="text-center">Community Reviews</h4>

                  <div className="reviews-list">
                    {/* Add sample reviews here */}
                    <div className="review text-md">
                      <b>Awesome</b>
                      <br /> Smell is 10/10 Taste is 10/10 High is 20/10 Smell
                      is 10/10 Taste is 10/10 High is 20/10 fireeeeee
                    </div>
                    <div className="review text-md">
                      <b>Lives up to the hype</b>
                      <br />
                      I've been using BakedBot for a while now and it's been a
                      game changer for me. I HIGHLY 🚀🪂✈
                    </div>
                    <div className="review text-md">
                      <b>Really Strong</b>
                      <br /> Its actually 32.21% total cannabinoids It's not
                      36.37% or whatever it says on the description.
                    </div>
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
