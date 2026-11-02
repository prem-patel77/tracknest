// Red message box with an optional "Try again" button.
// - message: text to show (nothing is rendered when it is empty)
// - onRetry: if given, shows a button that calls it (e.g. to reload the data)
export default function ErrorAlert({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="alert-error alert-row" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-outline btn-small" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
