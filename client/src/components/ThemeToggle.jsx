import { useState } from "react";
import { Icon } from "./Icons";
import { getTheme, applyTheme, saveTheme } from "../utils/theme";

// Sun / moon button that switches between the light and dark theme.
// - The first visit follows the system setting (index.html picks it before the page is drawn).
// - Once the user clicks, their choice is saved in localStorage and wins from then on.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme); // starts with whatever index.html chose

  const next = theme === "dark" ? "light" : "dark";

  const handleClick = () => {
    applyTheme(next); // change the page now
    saveTheme(next); // remember it for the next visit
    setTheme(next); // update the icon
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleClick}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {/* Show the icon of the theme you will GET: a sun in dark mode, a moon in light mode */}
      <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
    </button>
  );
}
