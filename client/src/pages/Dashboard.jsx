import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Temporary page - the real dashboard comes in Phase 10
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="center-text">
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}! ({user.email})</p>
      <button className="btn btn-inline" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}
