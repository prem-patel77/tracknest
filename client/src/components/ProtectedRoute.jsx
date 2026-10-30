import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps pages that need a logged-in user.
// Not logged in -> send to /login.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait for the /auth/me check so a refresh doesn't flash the login page
  if (loading) return <p className="center-text">Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
