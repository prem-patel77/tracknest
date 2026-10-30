import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

// The context holds the logged-in user and the auth functions,
// so any component can read them with useAuth().
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true until we finish checking whether a saved token is still valid
  const [loading, setLoading] = useState(true);

  // On first load: if a token is saved, ask the server who it belongs to
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("token")) // expired or invalid token
      .finally(() => setLoading(false));
  }, []);

  // Save the token and the user after a successful login/register
  const saveSession = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    saveSession(res.data);
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    saveSession(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Small helper so components can write: const { user, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
