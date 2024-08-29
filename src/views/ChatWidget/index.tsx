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
        <div
          className={`absolute right-2 bottom-14 flex justify-center items-center z-50 animate-open`}
        >
          <div className="dark-green-background p-3 pb-0 md:p-5 rounded-lg shadow-lg relative">
            <div className="md:flex md:flex-row flex-col gap-3 min-h-[250px] min-w-[180px] lg:min-h-[350px] lg:min-w-[800px]">
              {/* left box */}
              <div className="border-2 h-[450px] white-background off-white w-full md:w-3/4 relative rounded-md p-2 flex flex-col gap-2 overflow-hidden">
                <p className="text-lg md:text-xl font-bold dark-green">
                  BakedBot Chat
                </p>
                <ChatHistory
                  chatHistory={chatHistory}
                  loading={loading}
                  userPhoto={userPhoto}
                  botIcon={botIcon}
                  loadingIcon={loadingIcon}
                  chatEndRef={chatEndRef}
                />
                <div className="flex items-center gap-2 bottom-2 w-full">
                  <textarea
                    className="dark-green text-base md:text-lg border-none resize-none w-full placeholder-gray-600 "
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
                  <button
                    className="vibrant-green-background -background rounded-full text-white"
                    onClick={playHandler}
                    disabled={loading}
                  >
                    {loading ? (
                      <img
                        src={loadingIcon}
                        className="w-9 h-8 p-2"
                        alt="Loading"
                      />
                    ) : (
                      <img src={sendIcon} className="w-9 h-8 p-2" alt="Send" />
                    )}
                  </button>
                </div>
              </div>
              {/* right box */}
              <div className="border-2 mt-2 md:mt-0 w-[100%] white-background md:w-[35%] rounded-md p-2 flex flex-col justify-between gap-2 ">
                <div className="h-full min-h-[200px] rounded-md white-background  p-2 flex flex-col justify-between border-2 border-dark-green-1">
                  <p className="dark-green font-bold text-center md:text-lg mb-0">
                    Purple Punch I
                  </p>
                  <p className="dark-green text-center text-sm md:text-base mb-0">
                    A premium cannabis strain
                  </p>
                  <div className="flex-1 flex items-center justify-center">
                    <img
                      src={product1}
                      alt="Product Viewer"
                      className="w-full object-contain h-[100px] md:h-[150px]"
                    />
                  </div>
                </div>
                <div className="h-full vibrant-green-background rounded-md p-2">
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
                <div className="h-full vibrant-green-background rounded-md p-2">
                  <p className="text-white font-bold text-base md:text-lg mb-2">
                    Community Reviews
                  </p>
                  <p className="text-white font-normal text-sm md:text-base">
                    See what others are saying
                  </p>
                </div>
                {/* <div className="h-full rounded-md bg-[#00766D] p-2">
                  <p className="text-white font-bold text-base md:text-lg mb-2">
                    Cannabis 101
                  </p>
                  <p className="text-white font-normal text-sm md:text-base">
                    Learn about strains, effects, and more
                  </p>
                </div> */}
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
