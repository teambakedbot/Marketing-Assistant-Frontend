import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { saveThemeSettings, getThemeSettings } from "./api/renameChat";

interface SettingsPageProps {
  onClose: () => void;
  onSave: (settings: ThemeSettings) => void;
  initialSettings: ThemeSettings;
}

export interface ThemeSettings {
  primaryColor: string; //buttons color,  user message color
  secondaryColor: string; // robot message color, highlight color for active buttons,
  backgroundColor: string; //window background color
  headerColor: string; //header color, text input background color
  textColor: string; //text color, icon color
  textSecondaryColor: string; //text and button hover color
}

const presetThemes: { [key: string]: ThemeSettings } = {
  default: {
    primaryColor: "#22AD85",
    secondaryColor: "#23504A",
    backgroundColor: "#1E1E1E",
    headerColor: "#2C2C2C",
    textColor: "#FFFFFF",
    textSecondaryColor: "#FFFFFF",
  },
  light: {
    primaryColor: "#00A67D",
    secondaryColor: "#00766D",
    backgroundColor: "#FFFFFF",
    headerColor: "#F0F0F0",
    textColor: "#000000",
    textSecondaryColor: "#555555",
  },
};

const SettingsPage: React.FC<SettingsPageProps> = ({
  onClose,
  onSave,
  initialSettings,
}) => {
  const [themeSettings, setThemeSettings] =
    useState<ThemeSettings>(initialSettings);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const { user } = useAuth();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThemeSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
    setActivePreset(null);
  };

  const handlePresetSelect = (name: string, preset: ThemeSettings) => {
    setThemeSettings(preset);
    setActivePreset(name);
  };

  const handleRevert = () => {
    setThemeSettings(initialSettings);
    setActivePreset(null);
  };

  const handleSave = async () => {
    const token = await user!.getIdToken();
    saveThemeSettings(token, themeSettings);
    onSave(themeSettings);
    onClose();
  };

  useEffect(() => {
    const fetchThemeSettings = async () => {
      const token = await user!.getIdToken();
      const settings = await getThemeSettings(token);
      if (settings) {
        setThemeSettings(settings);
      }
    };
    fetchThemeSettings();
  }, []);

  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const themeSettingsOrder: (keyof ThemeSettings)[] = [
    "primaryColor",
    "secondaryColor",
    "backgroundColor",
    "headerColor",
    "textColor",
    "textSecondaryColor",
  ];

  return (
    <div className="bb-sm-settings-page bg-gray-900 text-white p-6 max-w-2xl mx-auto">
      <div className="bb-sm-settings-content grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {themeSettingsOrder.map((key) => (
          <div key={key} className="bb-sm-setting-item">
            <label htmlFor={key} className="block mb-2 font-medium">
              {formatLabel(key)}
            </label>
            <div className="flex items-center">
              <input
                type="color"
                id={key}
                name={key}
                value={themeSettings[key]}
                onChange={handleChange}
                className="w-10 h-10 rounded-l cursor-pointer border-r border-gray-600 bb-sm-input-color"
              />
              <input
                type="text"
                value={themeSettings[key]}
                onChange={handleChange}
                name={key}
                className="flex-grow --footer-text-color border border-gray-600 rounded-r px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bb-sm-preset-themes mb-8">
        <h3 className="text-xl font-bold mb-4">Preset Themes</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(presetThemes).map(([name, preset]) => (
            <button
              key={name}
              onClick={() => handlePresetSelect(name, preset)}
              className={`bb-sm-preset-theme-button p-3 rounded-lg text-center transition-all ${
                activePreset === name ? "ring-2 ring-blue-500" : ""
              }`}
              style={{
                backgroundColor: preset.backgroundColor,
                color: preset.textColor,
                border: `2px solid ${preset.primaryColor}`,
              }}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
              {activePreset === name && (
                <FaCheck className="inline-block ml-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bb-sm-settings-footer flex justify-between">
        <button
          onClick={handleSave}
          className="bb-sm-save-button bg-blue-600 font-bold py-2 px-4 rounded transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
