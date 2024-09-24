import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

interface SettingsPageProps {
  onClose: () => void;
  onSave: (settings: { colorScheme: string; voiceType: string }) => void;
  initialSettings: { colorScheme: string; voiceType: string };
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  onClose,
  onSave,
  initialSettings,
}) => {
  const [colorScheme, setColorScheme] = useState(initialSettings.colorScheme);
  const [voiceType, setVoiceType] = useState(initialSettings.voiceType);

  const handleSave = () => {
    onSave({ colorScheme, voiceType });
    onClose();
  };

  return (
    <div className="settings-page">
      <div className="settings-content">
        <div className="setting-item">
          <label htmlFor="colorScheme">Color Scheme:</label>
          <select
            id="colorScheme"
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div className="setting-item">
          <label htmlFor="voiceType">Voice Type:</label>
          <select
            id="voiceType"
            value={voiceType}
            onChange={(e) => setVoiceType(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
      <div className="settings-footer">
        <button onClick={handleSave} className="save-button">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
