import Brand from "./Brand";

// The frame around the login, register, demo and crash screens.
// Wide screens: a deep-teal panel (logo + one line) on the left, the form on the right.
// Narrow screens: the panel becomes a teal strip above the form (see index.css).
export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <Brand />
        <p className="auth-promise">Know where every application stands.</p>
      </div>
      <main className="auth-main">{children}</main>
    </div>
  );
}
