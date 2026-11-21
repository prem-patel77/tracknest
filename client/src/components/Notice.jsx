import { Icon } from "./Icons";

// Blue ("info") or green ("success") message box with an icon before the sentence.
// Errors use <ErrorAlert> instead.
export default function Notice({ type = "info", children }) {
  return (
    <div className={`alert-${type}`} role="status">
      <span className="alert-text">
        <Icon name={type === "success" ? "check" : "info"} size={18} />
        {children}
      </span>
    </div>
  );
}
