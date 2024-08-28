import React, { useEffect, useRef, useState } from "react";
import bottom from "/images/Chatbot logo white background large-circle.png";
import receiverIcon from "/images/receiver.jpeg";
import product1 from "/images/product1.png";
import sendIcon from "/images/send.png";
import axios from "axios";
import loadingIcon from "/images/loading-spinner-white.gif";
import Swal from "sweetalert2";
import ChatHistory from "../../components/ChatHistory";
import "./main.css";
import useAuth from "../../hooks/useAuth";

export const ChatWidget: React.FC = () => {
  const { displayName, photoURL, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [prompts, setPrompts] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<string[]>([
    `Hey, how can i help?`,
  ]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.valueAsNumber);
  };

  const handleModalBox = () => {
    setIsModalOpen(!isModalOpen);
  };

  const playHandler = (
    e?:
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (
      (e && "key" in e && e.key === "Enter" && !e.shiftKey) ||
      e?.type === "click"
    ) {
      e.preventDefault();
      if (!prompts || loading) return;
      setChatHistory((prevHistory) => [...prevHistory, prompts, "loading"]);
      setPrompts("");
      setLoading(true);
      axios
        .post(
          "https://cannabis-marketing-chatbot-224bde0578da.herokuapp.com/chat",
          { message: prompts }
        )
        .then((res) => {
          console.log(res?.data?.response);
          setChatHistory((prevHistory) => {
            const updatedHistory = [...prevHistory];
            updatedHistory[updatedHistory.length - 1] = res?.data?.response;
            return updatedHistory;
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "Fetching Chat Answer",
            text: err.message,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const userPhoto = photoURL || "/images/person-image.png";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory.length, loading]);

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
          <div className="bg-[#0D211D] p-3 pb-0md:p-5 rounded-lg shadow-lg relative">
            <div className="md:flex md:flex-row flex-col gap-3 min-h-[250px] min-w-[180px] lg:min-h-[350px] lg:min-w-[800px]">
              {/* left box */}
              <div className="border-2 h-[450px] bg-white w-full md:w-3/4 relative rounded-md p-2 flex flex-col gap-2 overflow-hidden">
                <p className="text-[#23504A] text-lg md:text-xl font-bold">
                  BakedBot Chat
                </p>
                <ChatHistory
                  chatHistory={chatHistory}
                  loading={loading}
                  userPhoto={userPhoto}
                  receiverIcon={receiverIcon}
                  loadingIcon={loadingIcon}
                  chatEndRef={chatEndRef}
                />
                <div className="flex items-center gap-2 bottom-2 w-full">
                  <textarea
                    className="text-[#23504A] text-base md:text-lg border-none resize-none w-full placeholder-gray-600"
                    onKeyDown={playHandler}
                    placeholder="Type your message..."
                    value={prompts}
                    onChange={(e) => setPrompts(e.target.value)}
                    rows={1}
                    style={{
                      overflowY: "auto",
                      padding: "8px",
                      maxHeight: "4.5em",
                    }}
                  />
                  <button
                    className="bg-[#22AD85] rounded-full text-white"
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
              <div className="border-2 mt-2 md:mt-0 w-[100%] bg-white md:w-[35%] rounded-md p-2 flex flex-col justify-between gap-2 ">
                <div className="h-full min-h-[200px] rounded-md bg-white p-2 flex flex-col justify-between border-2 border-[#00766D]">
                  <p className="text-[#00766D] font-bold text-center md:text-lg mb-0">
                    Purple Punch I
                  </p>
                  <p className="text-[#00766D] text-center text-sm md:text-base mb-0">
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
                <div className="h-full bg-[#22AD85] rounded-md p-2">
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
                    className="w-full h-1 bg-[#00766D] rounded-lg appearance-none border-0 outline-0 cursor-pointer accent-[#23504A]"
                    style={{
                      WebkitAppearance: "none",
                      appearance: "none",
                    }}
                  />
                  <div className="flex justify-between gap-1 text-sm text-gray-700 mt-4">
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
                  <style>
                    {`
                      input[type=range]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 14px;
                        height: 14px;
                        background: #23504A;
                        border-radius: 50%;
                        cursor: pointer;
                      }
                      input[type=range]::-moz-range-thumb {
                        width: 14px;
                        height: 14px;
                        background: #23504A;
                        border-radius: 50%;
                        cursor: pointer;
                      }
                    `}
                  </style>
                </div>
                {/* <div className="h-full rounded-md bg-[#00766D] p-2">
                  <p className="text-white font-bold text-base md:text-lg mb-2">
                    Cannabis 101
                  </p>
                  <p className="text-white font-normal text-sm md:text-base">
                    Learn about strains, effects, and more
                  </p>
                </div> */}
                <div className="h-full rounded-md bg-[#22AD85] p-2">
                  <p className="text-white font-bold text-base md:text-lg mb-2">
                    Community Reviews
                  </p>
                  <p className="text-white font-normal text-sm md:text-base">
                    See what others are saying
                  </p>
                </div>
              </div>
            </div>
            <p className="text-white mt-4  text-md">Powered by BakedBot AI</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
