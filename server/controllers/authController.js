const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { isText, validateName, validateEmail, validateNewPassword } = require("../utils/validators");

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const error = validateName(name) || validateEmail(email) || validateNewPassword(password);
    if (error) return res.status(400).json({ message: error });

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

    if (!isText(email) || !email.trim() || !isText(password) || !password) {
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

    const error = validateName(name) || validateEmail(email);
    if (error) return res.status(400).json({ message: error });

    const user = await User.findByIdWithHash(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== user.email) {
      // The email is changing: prove it is really the owner
      if (!isText(currentPassword) || !(await bcrypt.compare(currentPassword, user.password_hash))) {
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

    if (!isText(currentPassword) || !currentPassword) {
      return res.status(400).json({ message: "Current password is required" });
    }
    const error = validateNewPassword(newPassword, "New password");
    if (error) return res.status(400).json({ message: error });

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