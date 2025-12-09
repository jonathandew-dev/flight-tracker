import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

const DarkModeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};


export default DarkModeToggle;