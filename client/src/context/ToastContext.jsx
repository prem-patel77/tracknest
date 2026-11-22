import { useCallback, useEffect, useRef, useState } from "react";
import Toast from "../components/Toast";
import { ToastContext } from "./toastState";

const SHOW_FOR = 5000; // ms the message stays on screen before it disappears by itself

// Lives above the router (see main.jsx), so a message set right before navigate("/dashboard")
// is still on screen after the page changes. It shows one message at a time.
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { id, message } or null
  const timer = useRef(null);
  const count = useRef(0);

  const hideToast = useCallback(() => {
    clearTimeout(timer.current);
    setToast(null);
  }, []);

  const showToast = useCallback((message) => {
    clearTimeout(timer.current); // a newer message replaces the old one and restarts the timer
    count.current += 1;
    setToast({ id: count.current, message }); // a new id makes the box fade in again
    timer.current = setTimeout(hideToast, SHOW_FOR);
  }, [hideToast]);

  useEffect(() => () => clearTimeout(timer.current), []); // stop the timer if the app closes

  // The context value is the showToast function itself. useCallback keeps it the same between renders,
  // so pages that call useToast() do not re-render every time a message appears or disappears.
  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toast toast={toast} onClose={hideToast} />
    </ToastContext.Provider>
  );
}
