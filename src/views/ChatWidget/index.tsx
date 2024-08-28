import React, { useEffect, useRef, useState } from "react";
import bottom from "/images/Chatbot logo white background large-circle.png";
import receiverIcon from "/images/receiver.jpeg";
import product1 from "/images/product1.png";
import receiverIcon2 from "/images/receiver2.jpeg";
import sendIcon from "/images/send.png";
import axios from "axios";
import loadingIcon from "/images/loading-spinner-white.gif"; // Add a loading spinner icon
import Swal from "sweetalert2";
import "./main.css";
import ReactMarkdown from "react-markdown";

export const ChatWidget: React.FC = () => {
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
      setLoading(true);
      axios
        .post(
          "https://cannabis-marketing-chatbot-224bde0578da.herokuapp.com/chat",
          { message: prompts }
        )
        .then((res) => {
          console.log(res?.data?.response);
          setChatHistory((prevHistory) => [
            ...prevHistory,
            prompts,
            res?.data?.response,
          ]);
          setPrompts("");
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <div className="chat-widget">
      <button className="border-none outline-0" onClick={handleModalBox}>
        <img src={bottom} className="w-10" alt="Open Chatbot" />
      </button>
      {isModalOpen && (
        <div className="absolute right-2 bottom-14 flex justify-center items-center z-50">
          <div className="bg-[#0D211D] p-3 md:p-5 rounded-lg shadow-lg relative">
            <div className="md:flex md:flex-row flex-col gap-3 min-h-[250px] min-w-[180px] lg:min-h-[350px] lg:min-w-[800px]">
              {/* left box */}
              <div className="border-2 h-[450px] bg-white w-full md:w-3/4 relative rounded-md p-2 flex flex-col gap-2 overflow-hidden">
                <p className="text-[#23504A] text-lg md:text-xl font-bold">
                  BakedBot Chat
                </p>

                <div className="flex-1 overflow-y-auto mb-2">
                  {chatHistory.map((message, index) => (
                    <div
                      className="flex gap-2 mb-4"
                      key={`chat-message-${index}`}
                    >
                      <img
                        src={index % 2 === 0 ? receiverIcon : receiverIcon2}
                        className="w-8 h-8 rounded-full md:w-10 md:h-10"
                        alt={
                          index % 2 === 0 ? "Receiver Icon" : "BakedBot Icon"
                        }
                      />
                      <div className="bg-[#22AD85] rounded-md py-2 px-4">
                        <p className="text-white text-base md:text-lg">
                          <ReactMarkdown>{message}</ReactMarkdown>
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex items-center gap-3 bottom-2 w-11/12">
                  <textarea
                    className="border-black h-8 md:h-12 text-[#23504A] text-base md:text-lg border-2 rounded-3xl resize-none w-full px-4 py-0 pt-1"
                    onKeyDown={playHandler}
                    disabled={loading}
                    placeholder="Type your message..."
                    value={prompts}
                    onChange={(e) => setPrompts(e.target.value)}
                  ></textarea>
                  <button
                    className="bg-[#22AD85] rounded-full text-white"
                    onClick={playHandler}
                    disabled={loading}
                  >
                    <img
                      src={loading ? loadingIcon : sendIcon}
                      className="w-9 h-8 p-2"
                      alt="Send"
                    />
                  </button>
                </div>
              </div>
              {/* right box */}
              <div className="border-2 mt-2 md:mt-0 w-[100%] bg-white md:w-[35%] rounded-md p-2 flex flex-col justify-between gap-2 ">
                <div className="h-full min-h-[200px] rounded-md bg-white p-2 flex flex-col justify-between border-2 border-[#00766D]">
                  <p className="text-[#00766D] font-bold text-center md:text-lg mb-2">
                    Purple Punch I
                  </p>
                  <p className="text-[#00766D] text-center text-sm md:text-base mb-0">
                    A premium cannabis strain
                  </p>
                  <div className="flex-1 flex items-center justify-center">
                    <img
                      src={product1}
                      alt="Product Viewer"
                      className="w-full h-auto object-contain h-[100px] md:h-[150px]"
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
                    <span className="text-lg text-center md:leading-[8px] tracking-tighter">
                      🧘
                    </span>
                    <span className="text-lg text-center md:leading-[8px] tracking-tighter">
                      😌
                    </span>
                    <span className="text-lg text-center md:leading-[8px] tracking-tighter">
                      ⚡
                    </span>
                    <span className="text-lg text-center md:leading-[8px] tracking-tighter">
                      🚀
                    </span>
                    <span className="text-lg text-center md:leading-[8px] tracking-tighter">
                      🌟
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
            <p className="text-white mt-2  text-md">Powered by BakedBot AI</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
