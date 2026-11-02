// A small rotating circle. Used for page loading and inside buttons while saving.
// - small: true makes it fit inside a button
export default function Spinner({ small = false }) {
  return <span className={small ? "spinner spinner-small" : "spinner"} role="status" aria-label="Loading" />;
}
