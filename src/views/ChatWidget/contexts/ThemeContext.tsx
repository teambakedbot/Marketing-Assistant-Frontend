import React, { createContext, useContext, useState } from "react";
import { ThemeSettings } from "../settings";
interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (newTheme: ThemeSettings) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  initialSettings: ThemeSettings;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialSettings,
}) => {
  const [theme, setTheme] = useState<ThemeSettings>(initialSettings);

  const updateTheme = (newTheme: ThemeSettings) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
