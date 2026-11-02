// Catches requests that matched no route, e.g. GET /api/nothing -> 404 as JSON (not an HTML page)
const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Last line of defense: any error that was not handled in a controller ends up here.
// Express knows this is an error handler because it has FOUR parameters (err, req, res, next).
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Invalid JSON in the request body (body-parser sets err.type)
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body is not valid JSON" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }

  // Anything else is our bug: log the details for us, send a safe message to the user
  console.error(err);
  res.status(500).json({ message: "Server error" });
};

module.exports = { notFound, errorHandler };
