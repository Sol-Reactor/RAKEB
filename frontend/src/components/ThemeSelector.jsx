import { MoonIcon, TreePineIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "forest" : "dark";
    setTheme(newTheme);
  };

  return (
    <button
      onClick={handleThemeToggle}
      className="btn btn-ghost btn-circle"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <TreePineIcon className="size-5" />
      ) : (
        <MoonIcon className="size-5" />
      )}
    </button>
  );
}
export default ThemeSelector;
