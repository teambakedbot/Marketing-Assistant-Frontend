import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface CannabotWorkspaceProps {
  chatHistory: string[];
}

function CannabotWorkspace({ chatHistory }: CannabotWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("Chat");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Chat":
        return (
          <div
            className="text-[#110F0F] text-xxl font-istok-web max-h-[55vh]"
            style={{ overflowY: "auto" }}
          >
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className="chat-message"
                style={{ paddingBottom: "10px" }}
              >
                <strong>{index % 2 === 0 ? "Pops:" : "You:"}</strong> {message}
              </div>
            ))}
          </div>
        );
      case "Goals":
        return (
          <p className="font-bold text-[#110F0F] text-base font-istok-web">
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

  return (
    <div className="h-full">
      <h2 className="font-bold leading-[1.22em] mb-2 text-center">Workspace</h2>
      <div
        style={{ height: "inherit" }}
        className="border border-white py-0 [@media(min-width:600px)]:py-4 [@media(min-width:600px)]:px-3 px-0 rounded-3xl lg:rounded-lg"
      >
        <div className="bg-white rounded-[20px] h-full">
          <div className="rounded-xl flex flex-wrap">
            <button
              onClick={() => handleTabClick("Chat")}
              className="md:px-5 px-3 py-2 lg:py-2 lg:text-lg text-sm bg-[#7e7b7b] rounded-tl-2xl lg:rounded-tl-xl"
            >
              Chat
            </button>
            <button
              onClick={() => handleTabClick("Goals")}
              className="md:px-5 px-3 py-2 lg:py-2 lg:text-lg text-sm bg-[#3f3d3d] border-l-2 border-white"
            >
              Goals
            </button>
            <button
              onClick={() => handleTabClick("SMS")}
              className="md:px-5 px-3 py-2 lg:py-2 lg:text-lg text-sm bg-[#07e81a] border-l-2"
            >
              SMS
            </button>
            <button
              onClick={() => handleTabClick("Email")}
              className="md:px-5 px-3 py-2 lg:py-2 lg:text-lg text-sm bg-[#659422] border-l-2 border-r-2"
            >
              Email
            </button>
            <button
              onClick={() => handleTabClick("Content")}
              className="md:px-5 px-3 py-2 lg:py-2 lg:text-lg text-sm bg-[#304e05] md:rounded-none"
            >
              Content
            </button>
          </div>
          <SimpleBar>
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center justify-center gap-4 px-4 py-8 ">
                <img src="/images/image 7.png" alt="" />
                {renderContent()}
              </div>
              {/* <div className="h-[1200px]" /> */}
            </div>
          </SimpleBar>
        </div>
      </div>
    </div>
  );
}

export default CannabotWorkspace;
