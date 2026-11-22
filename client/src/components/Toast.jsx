import { Icon } from "./Icons";

// A short green confirmation ("Job added") at the bottom of the screen.
// The outer box is always on the page and has role="status": screen readers announce
// whatever text appears inside it, without moving the keyboard focus.
export default function Toast({ toast, onClose }) {
  return (
    <div className="toast-region" role="status">
      {toast && (
        <div className="toast" key={toast.id}>
          <Icon name="check" size={18} />
          <span className="toast-text">{toast.message}</span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Dismiss message">
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
