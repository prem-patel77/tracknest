import { createContext } from "react";

// The context object lives in its own file (not in AuthContext.jsx) so that
// AuthContext.jsx only exports a component, which keeps Vite's fast refresh working.
export const AuthContext = createContext(null);
