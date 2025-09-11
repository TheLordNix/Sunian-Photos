import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [colors, setColors] = useState(() => {
    const saved = localStorage.getItem("themeColors");
    return saved
      ? JSON.parse(saved)
      : {
          global: {
            bg: "rgba(121,255,255,1)",
            box: "rgba(240,192,133,1)",
            title: "rgba(255,102,0,1)",
            text: "#ffffff",
          },
          mainPage: {
            galleryBtn: "#3B82F6",
            uploadBtn: "#3B82F6",
            logoutBtn: "#3B82F6",
          },
          uploadPage: {
            selectBtn: "#3B82F6",
            submitBtn: "#3B82F6",
            imageBoxes: {}, // individual preview boxes
          },
          galleryPage: {
            imageBoxes: {}, // individual gallery boxes
          },
        };
  });

  useEffect(() => {
    localStorage.setItem("themeColors", JSON.stringify(colors));
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ colors, setColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
