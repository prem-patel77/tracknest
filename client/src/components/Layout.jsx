import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// The frame shared by all logged-in pages: sidebar on the left,
// navbar on top, and the current page (<Outlet />) in the middle.
export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">TrackNest</div>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/jobs/new">Add Job</NavLink>
          <NavLink to="/statistics">Statistics</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </aside>

      <div className="main-area">
        <header className="navbar">
          <span>Hi, {user.name}</span>
          <button className="btn btn-inline btn-outline" onClick={handleLogout}>
            Log out
          </button>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
