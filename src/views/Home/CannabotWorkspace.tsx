import React, { useState, useEffect, useRef } from "react";
import SimpleBar from "simplebar-react";
import ReactMarkdown from "react-markdown";
import "simplebar-react/dist/simplebar.min.css";
import receiverIcon from "/images/receiver.jpeg";
import receiverIcon2 from "/images/receiver2.jpeg";
import "../../styles/theme.css";
import useAuth from "../../hooks/useAuth";

interface CannabotWorkspaceProps {
  chatHistory: string[];
  voiceType: string;
}

function CannabotWorkspace({ chatHistory, voiceType }: CannabotWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("Chat");
  const { displayName, photoURL, user } = useAuth();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const userPhoto = photoURL || "/images/person-image.png";
  const renderContent = () => {
    switch (activeTab) {
      case "Chat":
        return (
          <div className="text-[#110F0F] text-xl font-istok-web max-h-[55vh] overflow-y-auto">
            {chatHistory.map((message, index) => (
              <div className="flex gap-2 mb-4" key={`chat-message-${index}`}>
                <img
                  src={index % 2 === 0 ? receiverIcon : userPhoto}
                  className="w-8 h-8 rounded-full md:w-10 md:h-10"
                  alt={index % 2 === 0 ? "Receiver Icon" : "BakedBot Icon"}
                />
                <div
                  className={`${
                    index % 2 === 0 ? "bg-[#22AD89]" : "bg-[#23504A]"
                  } rounded-md py-2 px-4`}
                >
                  <p className="text-white text-base md:text-lg">
                    <ReactMarkdown>{message}</ReactMarkdown>
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        );
      case "Goals":
        return (
          <p className="font-bold text-[#110F0F] text-base">
            Goals content goes here.
          </p>
        );
      case "SMS":
        return (
          <p className="font-bold text-[#110F0F] text-base font-istok-web">
            SMS content goes here.
          </p>
        );
      case "Email":
        return (
          <p className="font-bold text-[#110F0F] text-base font-istok-web">
            Email content goes here.
          </p>
        );
      case "Content":
        return (
          <p className="font-bold text-[#110F0F] text-base font-istok-web">
            Content content goes here.
          </p>
        );
      default:
        return null;
    }
  };

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="h-full">
      <h2 className="font-bold leading-[1.22em] mb-2 text-center">Workspace</h2>
      <div
        style={{ height: "inherit" }}
        className="border h-full border-white py-0 [@media(min-width:600px)]:py-4 [@media(min-width:600px)]:px-3 px-0 rounded-3xl lg:rounded-lg"
      >
        <div className="bg-white rounded-[20px] h-full">
          <div id="tabs" className="rounded-xl flex w-full">
            <button
              onClick={() => handleTabClick("Chat")}
              className="flex-1 py-2 lg:py-2 lg:text-lg text-sm dark-green-background-3 rounded-tl-2xl lg:rounded-tl-xl"
            >
              Chat
            </button>
            <button
              onClick={() => handleTabClick("Goals")}
              className="flex-1 py-2 lg:py-2 lg:text-lg text-sm dark-green-background-2"
            >
              Goals
            </button>
            <button
              onClick={() => handleTabClick("SMS")}
              className="flex-1 py-2 lg:py-2 lg:text-lg text-sm vibrant-green"
            >
              SMS
            </button>
            <button
              onClick={() => handleTabClick("Email")}
              className="flex-1 py-2 lg:py-2 lg:text-lg text-sm bright-orange"
            >
              Email
            </button>
            <button
              onClick={() => handleTabClick("Content")}
              className="flex-1 py-2 lg:py-2 lg:text-lg text-sm medium-gray md:rounded-none rounded-tr-2xl lg:rounded-tr-xl"
            >
              Content
            </button>
          </div>
          <SimpleBar>
            <div className="h-full flex flex-col ">
              <div className="flex  gap-4 px-4 py-8 ">{renderContent()}</div>
              {/* <div className="h-[1200px]" /> */}
            </div>
          </SimpleBar>
        </div>
      </div>
    </div>
  );
}

export default CannabotWorkspace;
