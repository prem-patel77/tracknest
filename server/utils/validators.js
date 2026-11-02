// Shared checks used by the auth and job controllers.
// Each "validate" function returns an error message (string) or null when the value is fine.
// The length limits match the column sizes in schema.sql.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: 100,
  email: 255,
  password: 72, // bcrypt only uses the first 72 bytes, so longer passwords add nothing
  company: 150,
  job_title: 150,
  location: 150,
  salary: 50,
  notes: 5000,
};

// req.body values can be anything (numbers, objects, arrays), so check the type before calling .trim()
const isText = (value) => typeof value === "string";

const validateName = (name) => {
  if (!isText(name) || !name.trim()) return "Name is required";
  if (name.trim().length > LIMITS.name) return `Name must be at most ${LIMITS.name} characters`;
  return null;
};

const validateEmail = (email) => {
  if (!isText(email) || !email.trim()) return "Email is required";
  if (email.trim().length > LIMITS.email) return "Email is too long";
  if (!EMAIL_REGEX.test(email.trim())) return "Please enter a valid email";
  return null;
};

// Used when CHOOSING a password (register / change password), not when logging in
const validateNewPassword = (password, label = "Password") => {
  if (!isText(password) || !password) return `${label} is required`;
  if (password.length < 8) return `${label} must be at least 8 characters`;
  if (password.length > LIMITS.password) return `${label} must be at most ${LIMITS.password} characters`;
  return null;
};

// "2026-02-31" looks fine but is not a real day, so rebuild the date and compare
const isRealDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

// Only web links are allowed (blocks things like "javascript:alert(1)" being saved as a job link)
const isWebUrl = (value) => {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

module.exports = { LIMITS, isText, isRealDate, isWebUrl, validateName, validateEmail, validateNewPassword };
