import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Brand from "./Brand";
import { Icon } from "./Icons";

// The frame shared by all logged-in pages: sidebar on the left,
// navbar on top, and the current page (<Outlet />) in the middle.
export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Sidebar links: where they go, their icon and their label
  const links = [
    { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { to: "/jobs/new", icon: "plus", label: "Add Job" },
    { to: "/statistics", icon: "chart", label: "Statistics" },
    { to: "/profile", icon: "user", label: "Profile" },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <Brand />
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} title={link.label} aria-label={link.label}>
              <Icon name={link.icon} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-area">
        <header className="navbar">
          <span className="navbar-greeting">Welcome back, <strong>{user.name}</strong></span>
          <div className="navbar-right">
            <span className="avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
            <button className="btn btn-inline btn-outline btn-small" onClick={handleLogout}>
              <Icon name="logout" size={16} />
              Log out
            </button>
          </div>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
