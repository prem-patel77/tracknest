import { LIMITS } from "./constants";

// Small helpers shared by the forms (login, register, job form, profile).

// "name@site.com" -> true. A simple check; the server validates again.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns the error message for an email value, or undefined when it is fine
export function validateEmail(value) {
  if (!value.trim()) return "Enter your email";
  if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email, like name@school.edu";
}

// Same rules as the server: 8 to 72 characters. Returns a message, or undefined when it is fine.
export function validatePassword(value) {
  if (!value) return "Enter a password";
  if (value.length < 8) return "Use at least 8 characters";
  if (value.length > LIMITS.password) return `Use at most ${LIMITS.password} characters`;
}

// The "type it again" box must match the password above it
export function validateConfirm(value, password) {
  if (!value) return "Type the password again";
  if (value !== password) return "The passwords do not match";
}

// Builds an onChange handler for one field: it stores the typed value and
// clears that field's error message, so the red text goes away as soon as the user edits.
// Example: onChange={clearOnChange(setEmail, setErrors, "email")}
export const clearOnChange = (setValue, setErrors, field) => (e) => {
  setValue(e.target.value);
  setErrors((prev) => ({ ...prev, [field]: undefined }));
};

// After a failed check, put the cursor in the first field with a problem.
// This works because every field's id is the same as its key in the errors object,
// and validate() adds the errors in the order the fields appear on the page.
export function focusFirstError(errors) {
  const firstField = Object.keys(errors)[0];
  if (firstField) document.getElementById(firstField)?.focus();
}
