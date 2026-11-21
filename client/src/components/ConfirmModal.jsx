import { useEffect, useRef } from "react";
import Spinner from "./Spinner";

// A popup that asks "are you sure?" before a dangerous action.
// - message: the question to show
// - onConfirm / onCancel: called when the user clicks a button
// - busy: true while the action is running (disables the buttons)
export default function ConfirmModal({ message, onConfirm, onCancel, busy }) {
  const modalRef = useRef(null);
  const cancelRef = useRef(null);

  // Keep the newest props in a ref, so the keyboard effect below can run only once
  // (the parent creates a new onCancel function on every render)
  const latest = useRef({ onCancel, busy });
  useEffect(() => {
    latest.current = { onCancel, busy };
  });

  // Keyboard support (a popup must not leave keyboard users stuck behind it):
  // - move focus into the popup when it opens, and give it back when it closes
  // - Escape closes it
  // - Tab stays inside the popup instead of reaching the page behind it
  useEffect(() => {
    const opener = document.activeElement; // the button that opened the popup
    cancelRef.current.focus(); // start on "Cancel", the safe choice

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !latest.current.busy) latest.current.onCancel();

      if (e.key === "Tab") {
        const buttons = modalRef.current.querySelectorAll("button:not(:disabled)");
        if (buttons.length === 0) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={busy ? undefined : onCancel}>
      {/* stopPropagation: clicking inside the box shouldn't close it */}
      <div
        className="modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title">Delete this job?</h2>
        <p>{message}</p>
        <div className="form-actions">
          <button className="btn btn-inline btn-danger" onClick={onConfirm} disabled={busy}>
            {busy && <Spinner small />}
            {busy ? "Deleting..." : "Delete"}
          </button>
          <button className="btn btn-inline btn-outline" onClick={onCancel} disabled={busy} ref={cancelRef}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
