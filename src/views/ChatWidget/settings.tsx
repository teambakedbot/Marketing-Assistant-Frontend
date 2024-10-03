import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { saveThemeSettings, getThemeSettings } from "./api/renameChat";
import { Logout } from "iconsax-react";
import { Switch } from "@headlessui/react";

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
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  const [allowAnywhere, setAllowAnywhere] = useState(true);

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

  const handleAllowAnywhereToggle = (checked: boolean) => {
    setAllowAnywhere(checked);
    if (checked) {
      setSettings((prev) => ({ ...prev, allowedSites: [] }));
    }
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
  const themeSettingsOrder: (keyof ThemeSettings["colors"])[] = [
    "primaryColor",
    "secondaryColor",
    "backgroundColor",
    "headerColor",
    "textColor",
    "textSecondaryColor",
  ];

  return (
    <div className="bb-sm-settings-page p-6 rounded-lg flex flex-col h-full">
      <div className="bb-sm-settings-content space-y-6 flex-grow overflow-auto">
        <div className="bb-sm-user-settings">
          <h2 className="text-2xl font-bold mb-4">User Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bb-sm-setting-item">
              <label
                htmlFor="botVoice"
                className="block mb-2 text-lg font-medium"
              >
                Bot Voice
              </label>
              <select
                id="botVoice"
                name="botVoice"
                value={settings.botVoice}
                onChange={handleChange}
                className="w-full "
              >
                <option value="normal">Normal</option>
                <option value="smokey">Smokey</option>
                <option value="pops">Pops</option>
              </select>
            </div>
            <div className="bb-sm-setting-item">
              <label
                htmlFor="defaultLanguage"
                className="block mb-2 text-lg font-medium"
              >
                Default Language
              </label>
              <select
                id="defaultLanguage"
                name="defaultLanguage"
                value={settings.defaultLanguage}
                onChange={handleChange}
                className="w-full border "
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bb-sm-admin-settings">
          <button
            onClick={() => setIsAdminSettingsOpen(!isAdminSettingsOpen)}
            className="w-full text-left p-3 rounded-md flex justify-between items-center transition-colors border-b bb-sm-accordion-button"
          >
            <span className="text-lg font-semibold">Admin Settings</span>
            <span>{isAdminSettingsOpen ? "▲" : "▼"}</span>
          </button>
          {isAdminSettingsOpen && (
            <div className="mt-4 px-4">
              <div className="bb-sm-setting-item mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-lg font-medium self-end">
                    Widget Visibility
                  </label>
                  <div className="bb-sm-toggle-container flex items-center">
                    <span
                      className={`bb-sm-toggle-label mr-2 ${
                        !allowAnywhere ? "bb-sm-toggle-active" : ""
                      }`}
                    >
                      Restricted
                    </span>
                    <div className="relative inline-flex items-center">
                      <button
                        onClick={() =>
                          handleAllowAnywhereToggle(!allowAnywhere)
                        }
                        className={`bb-sm-switch w-14 h-7 bg-gray-300 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          allowAnywhere ? "bg-green-500" : ""
                        }`}
                      >
                        <span
                          className={`bb-sm-switch-slider block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                            allowAnywhere ? "translate-x-7" : ""
                          }`}
                        />
                      </button>
                    </div>
                    <span
                      className={`bb-sm-toggle-label ml-2 ${
                        allowAnywhere ? "bb-sm-toggle-active" : ""
                      }`}
                    >
                      Everywhere
                    </span>
                  </div>
                </div>

                {!allowAnywhere && (
                  <div className="mt-4">
                    <label
                      htmlFor="allowedSites"
                      className="block mb-2 text-md font-medium"
                    >
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
                      placeholder="Enter allowed domains, e.g., example.com"
                    />
                  </div>
                )}
              </div>

              <div className="bb-sm-preset-themes mb-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="presetTheme" className="text-lg font-medium">
                    Preset Theme
                  </label>
                  <select
                    id="presetTheme"
                    value={activePreset || "custom"}
                    onChange={(e) => {
                      const selected = e.target.value;
                      if (selected === "custom") {
                        handleCustomTheme();
                      } else {
                        handlePresetSelect(selected, presetThemes[selected]);
                      }
                    }}
                    className="w-1/2 p-2 border rounded bb-sm-input-color"
                  >
                    {Object.keys(presetThemes).map((name) => (
                      <option key={name} value={name}>
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </option>
                    ))}
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              {showCustomTheme && (
                <div className="bb-sm-theme-settings">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pt-5">
                    {themeSettingsOrder.map((key) => (
                      <div key={key} className="bb-sm-setting-item">
                        <label htmlFor={key} className="block mb-2 text-md">
                          {formatLabel(key)}
                        </label>
                        <div className="flex flex-row items-center gap-2">
                          <input
                            type="color"
                            id={key}
                            name={key}
                            value={settings.colors[key]}
                            onChange={handleChange}
                            className="w-10 h-10 rounded-l cursor-pointer "
                            style={{
                              padding: 0,
                              border: "none",
                            }}
                          />
                          <input
                            type="text"
                            value={settings.colors[key]}
                            onChange={handleChange}
                            name={key}
                            className="border rounded-r py-2 bb-sm-input-color"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bb-sm-settings-footer sticky bottom-0 flex justify-between gap-4 pt-4 border-t border-gray-300 dark:border-gray-600">
        <button
          onClick={handleSave}
          className="bb-sm-save-button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
        >
          Save Changes
        </button>
        <button
          onClick={() => Logout().then(() => onClose(true))}
          className="bb-sm-revert-button bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
