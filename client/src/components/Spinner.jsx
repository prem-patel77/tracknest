// A small rotating circle. Used for page loading and inside buttons while saving.
// - small: true makes it fit inside a button
export default function Spinner({ small = false }) {
  // The small spinner sits next to a button label that already says what is happening ("Deleting..."),
  // so only the big page spinner is announced to screen readers
  if (small) return <span className="spinner spinner-small" aria-hidden="true" />;
  return <span className="spinner" role="status" aria-label="Loading" />;
}
