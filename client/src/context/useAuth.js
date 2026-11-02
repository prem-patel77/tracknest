import { useContext } from "react";
import { AuthContext } from "./authState";

// Small helper so components can write: const { user, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
