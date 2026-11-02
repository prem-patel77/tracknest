require("dotenv").config();
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const pool = require("./config/db");
const express = require("express");
const cors = require("cors");

const app = express();

// Allowed frontend origins come from CLIENT_URL (comma-separated), e.g.
// "https://tracknest.vercel.app,http://localhost:5173". Defaults to local dev.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, "")) // drop spaces and a trailing slash
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.json({ message: "TrackNest API is running" });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ connected: true, time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ connected: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});