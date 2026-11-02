const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.createUser(name.trim(), normalizedEmail, passwordHash);

    res.status(201).json({ user, token: createToken(user.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findByEmail(email.trim().toLowerCase());
    const passwordMatches = user && (await bcrypt.compare(password, user.password_hash));

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token: createToken(user.id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/auth/profile  { name, email, currentPassword }
// Changing the name is free. Changing the email (it is the login) needs the current password.
const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword } = req.body;

    if (!String(name || "").trim() || !String(email || "").trim()) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const user = await User.findByIdWithHash(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== user.email) {
      // The email is changing: prove it is really the owner
      if (!currentPassword || !(await bcrypt.compare(currentPassword, user.password_hash))) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      const taken = await User.findByEmail(normalizedEmail);
      if (taken) {
        return res.status(409).json({ message: "Email is already registered" });
      }
    }

    const updated = await User.updateProfile(req.userId, name.trim(), normalizedEmail);
    res.json({ user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/auth/password  { currentPassword, newPassword }
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const user = await User.findByIdWithHash(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!(await bcrypt.compare(currentPassword, user.password_hash))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    await User.updatePassword(req.userId, await bcrypt.hash(newPassword, 10));
    res.json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };