import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { saveThemeSettings, getThemeSettings } from "./api/renameChat";
import { Logout } from "iconsax-react";

interface SettingsPageProps {
  onClose: (signOut?: boolean) => void;
  onSave: (settings: ThemeSettings) => void;
  initialSettings: ThemeSettings;
}

export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  headerColor: string;
  textColor: string;
  textSecondaryColor: string;
}

export interface ThemeSettings {
  colors: ThemeColors;
  defaultLanguage: string;
  defaultTheme: string;
  botVoice: string;
  allowedSites: string[];
}

const presetThemes: { [key: string]: ThemeColors } = {
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
    textSecondaryColor: "#FFFFFF",
  },
};

const SettingsPage: React.FC<SettingsPageProps> = ({
  onClose,
  onSave,
  initialSettings,
}) => {
  const [settings, setSettings] = useState<ThemeSettings>(initialSettings);
  const [activePreset, setActivePreset] = useState<string | null>(
    settings.defaultTheme
  );
  const [showCustomTheme, setShowCustomTheme] = useState(
    settings.defaultTheme === "custom"
  );
  const [allowedSitesRows, setAllowedSitesRows] = useState(1);
  const allowedSitesRef = useRef<HTMLTextAreaElement>(null);

  const { user, Logout } = useAuth();
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name in settings.colors) {
      setSettings((prev) => ({
        ...prev,
        colors: { ...prev.colors, [name]: value },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: name === "allowedSites" ? value.split("\n") : value,
      }));
    }
    if (Object.keys(presetThemes).includes(name)) {
      setActivePreset(null);
    }
  };

  const handlePresetSelect = (name: string, preset: ThemeColors) => {
    setSettings((prev) => ({
      ...prev,
      colors: preset,
      defaultTheme: name,
    }));
    setActivePreset(name);
    setShowCustomTheme(false);
  };

  const handleCustomTheme = () => {
    setActivePreset(null);
    setShowCustomTheme(true);
    setSettings((prev) => ({ ...prev, defaultTheme: "custom" }));
  };

  const handleSave = async () => {
    if (!user) return;
    const token = await user.getIdToken();
    saveThemeSettings(token, settings);
    onSave(settings);
  };

  const handleRevert = () => {
    setSettings(initialSettings);
    setActivePreset(null);
  };

  useEffect(() => {
    const fetchThemeSettings = async () => {
      if (!user) return;
      const token = await user?.getIdToken();
      const settings = await getThemeSettings(token);
      if (settings) {
        setSettings(settings);
      }
    };
    fetchThemeSettings();
  }, [user]);

  useEffect(() => {
    if (allowedSitesRef.current) {
      const lineCount = settings.allowedSites.length;
      setAllowedSitesRows(Math.min(Math.max(lineCount, 1), 5));
    }
  }, [settings.allowedSites]);

  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bb-sm-settings-page bg-gray-900 text-white p-6 max-w-2xl mx-auto h-full overflow-y-auto w-full">
      <div className="bb-sm-settings-content">
        <div className="bb-sm-additional-settings">
          <div className="grid grid-cols-1 gap-2">
            <div className="bb-sm-setting-item">
              <label htmlFor="botVoice" className="block mb-2 text-lg">
                Bot Voice
              </label>
              <select
                id="botVoice"
                name="botVoice"
                value={settings.botVoice}
                onChange={handleChange}
                className="w-full border border-gray-600 rounded px-3 py-2 bb-sm-input-color"
              >
                <option value="normal">Normal</option>
                <option value="smokey">Smokey</option>
                <option value="pops">Pops</option>
              </select>
            </div>
            <div className="bb-sm-setting-item">
              <label htmlFor="allowedSites" className="block mb-2 text-lg">
                Allowed Sites (one per line)
              </label>
              <textarea
                ref={allowedSitesRef}
                id="allowedSites"
                name="allowedSites"
                value={settings.allowedSites.join("\n")}
                onChange={handleChange}
                className="w-full rounded px-3 py-2 bb-sm-input-color"
                rows={allowedSitesRows}
              />
            </div>
            <div className="bb-sm-setting-item">
              <label htmlFor="defaultLanguage" className="block mb-2 text-lg">
                Default Language
              </label>
              <select
                id="defaultLanguage"
                name="defaultLanguage"
                value={settings.defaultLanguage}
                onChange={handleChange}
                className="w-full border border-gray-600 rounded px-3 py-2 bb-sm-input-color"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bb-sm-preset-themes mb-4 mt-2">
          <h3 className="text-lg mb-2">Preset Themes</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(presetThemes).map(([name, preset]) => (
              <button
                key={name}
                onClick={() => handlePresetSelect(name, preset)}
                className={`bb-sm-preset-theme-button p-1 rounded-lg text-center transition-all ${
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
            <button
              onClick={handleCustomTheme}
              className={`bb-sm-preset-theme-button p-1 rounded-lg text-center transition-all ${
                showCustomTheme ? "ring-2 ring-blue-500" : ""
              }`}
              style={{
                backgroundColor: settings.colors.backgroundColor,
                color: settings.colors.textColor,
                border: `2px solid ${settings.colors.primaryColor}`,
              }}
            >
              Custom
              {showCustomTheme && <FaCheck className="inline-block ml-2" />}
            </button>
          </div>
        </div>

        {showCustomTheme && (
          <div className="bb-sm-theme-settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.keys(settings.colors).map((key) => (
                <div key={key} className="bb-sm-setting-item">
                  <label htmlFor={key} className="block mb-2 text-md">
                    {formatLabel(key)}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      style={{ border: "none" }}
                      id={key}
                      name={key}
                      value={settings.colors[key as keyof ThemeColors]}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-l cursor-pointer bb-sm-input-color"
                    />
                    <input
                      type="text"
                      value={settings.colors[key as keyof ThemeColors]}
                      onChange={handleChange}
                      name={key}
                      className="flex-grow --footer-text-color border border-gray-600 rounded-r px-3 py-2 bb-sm-input-color"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bb-sm-settings-footer sticky bottom-0 flex justify-between gap-4 mt-4">
          <button
            onClick={handleSave}
            className="bb-sm-save-button bg-blue-600 font-bold py-2 px-4 rounded transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={() => Logout().then(() => onClose(true))}
            className="bb-sm-revert-button bg-red-600 font-bold text-white py-2 px-4 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
