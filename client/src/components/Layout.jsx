import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Brand from "./Brand";
import ThemeToggle from "./ThemeToggle";
import { Icon } from "./Icons";

// The frame shared by all logged-in pages: a sidebar on the left
// (it becomes a bar across the top on small screens) and the current page (<Outlet />).
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
      {/* Lets keyboard users jump past the sidebar */}
      <a href="#main" className="skip-link">Skip to content</a>

      <aside className="sidebar">
        <Brand />
        <nav className="sidebar-nav" aria-label="Main">
          {links.map((link) => (
            // The label is hidden on phones (icons only), so aria-label keeps it readable for screen readers
            <NavLink key={link.to} to={link.to} title={link.label} aria-label={link.label}>
              <Icon name={link.icon} size={20} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Who is logged in, with the log out button */}
        <div className="sidebar-user">
          <span className="avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
          <span className="sidebar-user-name">{user.name}</span>
          <ThemeToggle />
          <button className="logout-btn" onClick={handleLogout} title="Log out" aria-label="Log out">
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>

      <div className="main-area">
        <main className="page" id="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
