// A popup that asks "are you sure?" before a dangerous action.
// - message: the question to show
// - onConfirm / onCancel: called when the user clicks a button
// - busy: true while the action is running (disables the buttons)
export default function ConfirmModal({ message, onConfirm, onCancel, busy }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      {/* stopPropagation: clicking inside the box shouldn't close it */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Are you sure?</h2>
        <p>{message}</p>
        <div className="form-actions">
          <button className="btn btn-inline btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting..." : "Delete"}
          </button>
          <button className="btn btn-inline btn-outline" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
