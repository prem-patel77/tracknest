import { createContext } from "react";

// The context object lives in its own file (like authState.js) so that
// ToastContext.jsx only exports a component, which keeps Vite's fast refresh working.
export const ToastContext = createContext(null);
