import React from "react";
import { FaComments, FaStore, FaQuestion, FaInfoCircle } from "react-icons/fa";

const NewChatView: React.FC = () => {
  return (
    <div className="bb-sm-new-chat-view">
      <h2 className="bb-sm-new-chat-title">How can I help you today?</h2>
      <p className="bb-sm-new-chat-description">
        Choose an option to get started
      </p>
      <div className="bb-sm-new-chat-buttons">
        <button className="bb-sm-new-chat-button">
          <FaComments className="bb-sm-new-chat-button-icon" />
          Start a Chat
        </button>
        <button className="bb-sm-new-chat-button">
          <FaStore className="bb-sm-new-chat-button-icon" />
          Browse Store
        </button>
        <button className="bb-sm-new-chat-button">
          <FaQuestion className="bb-sm-new-chat-button-icon" />
          FAQ
        </button>
        <button className="bb-sm-new-chat-button">
          <FaInfoCircle className="bb-sm-new-chat-button-icon" />
          About Us
        </button>
      </div>
    </div>
  );
};

export default NewChatView;
