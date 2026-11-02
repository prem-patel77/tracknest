import { useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./authState";

// The provider holds the logged-in user and the auth functions,
// so any component can read them with useAuth() (see useAuth.js).

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true until we finish checking whether a saved token is still valid.
  // With no saved token there is nothing to check, so we start as "not loading".
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

  // On first load: if a token is saved, ask the server who it belongs to
  useEffect(() => {
    if (!localStorage.getItem("token")) return;

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
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
