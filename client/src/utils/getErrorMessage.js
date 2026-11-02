// Turns any axios error into a short, friendly sentence for the user.
// - fallback: what to say for errors we don't recognise, e.g. "Could not load jobs"
export function getErrorMessage(err, fallback = "Something went wrong") {
  // No response at all: the request timed out, the server is down or the user is offline
  if (!err.response) {
    if (err.code === "ECONNABORTED") {
      return "The server is taking too long to respond. Please try again in a moment.";
    }
    return "Can't reach the server. Check your internet connection and try again.";
  }

  const { status, data } = err.response;

  // 5xx: our fault, not the user's. Don't show technical details.
  if (status >= 500) {
    return "Something went wrong on our side. Please try again in a moment.";
  }
  if (status === 429) return "Too many requests. Please wait a moment and try again.";

  // 4xx: the server explains what is wrong (e.g. "Email is already registered")
  return data?.message || fallback;
}
