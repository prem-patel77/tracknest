// Helpers for the light / dark theme.
// The theme lives on the <html> element as data-theme="light" or data-theme="dark".
// index.html sets it before the page is drawn; index.css turns it into colors.
// (The small script in index.html repeats the "saved choice, else system setting" rule on purpose:
// it has to run before React loads, so the page never flashes the wrong theme. Keep the two in step.)
const STORAGE_KEY = "theme";

// Which theme is showing right now?
export function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

// Show a theme (this only changes the page, it does not remember anything)
export function applyTheme(theme) {
  const root = document.documentElement;
  // Switch off every CSS transition for one frame, so the colors change instantly (see .theme-switching)
  root.classList.add("theme-switching");
  root.setAttribute("data-theme", theme);
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
}

// Remember the user's choice for next time.
// localStorage can be blocked (for example in private mode), so we ignore errors.
export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Not saved, but the theme still changes for this visit
  }
}
