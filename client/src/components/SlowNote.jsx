import { useEffect, useState } from "react";

// The free server can take up to a minute to wake up. Show this note under a loading
// state, but only if the wait lasts more than 4 seconds, so a visitor knows it is not broken.
// Mount it only while loading: it starts counting when it appears and stops when it leaves.
export default function SlowNote() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 4000);
    return () => clearTimeout(timer); // leaving the page cancels the timer
  }, []);

  if (!show) return null;

  return (
    <p className="slow-note" role="status">
      Waking the server. Free hosting can take up to a minute on the first visit.
    </p>
  );
}
