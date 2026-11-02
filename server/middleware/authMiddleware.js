const jwt = require("jsonwebtoken");

// A 401 from here always carries code "AUTH_REQUIRED" so the client can tell
// "your login expired" apart from other 401s like "wrong current password".
const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token", code: "AUTH_REQUIRED" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Session expired, please log in again", code: "AUTH_REQUIRED" });
  }
};

module.exports = protect;