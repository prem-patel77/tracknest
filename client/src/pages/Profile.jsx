import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import Field from "../components/Field";
import ErrorAlert from "../components/ErrorAlert";
import Notice from "../components/Notice";
import Spinner from "../components/Spinner";
import { DEMO_EMAIL, LIMITS } from "../utils/constants";
import { clearOnChange, focusFirstError, validateConfirm, validateEmail, validatePassword } from "../utils/forms";
import { getErrorMessage } from "../utils/getErrorMessage";

// Two separate forms: one for name/email, one for the password.
export default function Profile() {
  const { user, setUser } = useAuth();

  // ----- Form 1: name and email -----
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [emailPassword, setEmailPassword] = useState(""); // only needed if the email changes
  const [profileErrors, setProfileErrors] = useState({}); // per-field messages
  const [profileError, setProfileError] = useState(""); // message from the API
  const [profileSaved, setProfileSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Show the password box only when the email was edited
  const emailChanged = email.trim().toLowerCase() !== user.email;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSaved(false);

    const newErrors = {};
    if (!name.trim()) newErrors.name = "Enter your name";
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    if (emailChanged && !emailPassword) newErrors.emailPassword = "Enter your current password to change your email";
    setProfileErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return focusFirstError(newErrors);

    setSavingProfile(true);
    try {
      const res = await api.put("/auth/profile", {
        name,
        email,
        currentPassword: emailPassword,
      });
      setUser(res.data.user); // updates the name shown in the sidebar too
      setName(res.data.user.name);
      setEmail(res.data.user.email);
      setEmailPassword("");
      setProfileSaved(true);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not update profile"));
    } finally {
      setSavingProfile(false);
    }
  };

  // ----- Form 2: password -----
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);

    // Check on the client first so the user gets instant feedback (same rules as the server)
    const newErrors = {};
    if (!currentPassword) newErrors.currentPassword = "Enter your current password";
    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError) newErrors.newPassword = newPasswordError;
    const confirmError = validateConfirm(confirmPassword, newPassword);
    if (confirmError) newErrors.confirmPassword = confirmError;
    setPasswordErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return focusFirstError(newErrors);

    setSavingPassword(true);
    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSaved(true);
    } catch (err) {
      setPasswordError(getErrorMessage(err, "Could not update password"));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p className="page-subtitle">Manage your account details and password.</p>
        </div>
      </div>

      <div className="form-stack">
        {/* The server blocks these changes for the shared demo account, so say so up front */}
        {user.email === DEMO_EMAIL && (
          <Notice>
            You are using the shared demo account, so profile and password changes are turned off.
            Create your own account to try them.
          </Notice>
        )}

        {/* onChange on the <form> catches typing in any of its fields: old messages go away once you edit */}
        <form
          className="module"
          onSubmit={handleProfileSubmit}
          onChange={() => {
            setProfileSaved(false);
            setProfileError("");
          }}
          noValidate
        >
          <h2 className="module-tab">Account details</h2>
          <div className="module-body">
            <Field
              id="name"
              label="Name"
              value={name}
              onChange={clearOnChange(setName, setProfileErrors, "name")}
              error={profileErrors.name}
              maxLength={LIMITS.name}
              autoComplete="name"
            />
            <Field
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={clearOnChange(setEmail, setProfileErrors, "email")}
              error={profileErrors.email}
              maxLength={LIMITS.email}
              autoComplete="email"
            />
            {emailChanged && (
              <Field
                id="emailPassword"
                label="Current password"
                type="password"
                hint="Needed to change your email."
                value={emailPassword}
                onChange={clearOnChange(setEmailPassword, setProfileErrors, "emailPassword")}
                error={profileErrors.emailPassword}
                autoComplete="current-password"
              />
            )}

            <ErrorAlert message={profileError} />
            {profileSaved && <Notice type="success">Profile updated.</Notice>}

            <div className="form-actions">
              <button type="submit" className="btn btn-inline" disabled={savingProfile}>
                {savingProfile && <Spinner small />}
                {savingProfile ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>

        <form
          className="module"
          onSubmit={handlePasswordSubmit}
          onChange={() => {
            setPasswordSaved(false);
            setPasswordError("");
          }}
          noValidate
        >
          <h2 className="module-tab">Change password</h2>
          <div className="module-body">
            <Field
              id="currentPassword"
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={clearOnChange(setCurrentPassword, setPasswordErrors, "currentPassword")}
              error={passwordErrors.currentPassword}
              autoComplete="current-password"
            />
            <Field
              id="newPassword"
              label="New password"
              type="password"
              hint="At least 8 characters."
              value={newPassword}
              onChange={clearOnChange(setNewPassword, setPasswordErrors, "newPassword")}
              error={passwordErrors.newPassword}
              maxLength={LIMITS.password}
              autoComplete="new-password"
            />
            <Field
              id="confirmPassword"
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={clearOnChange(setConfirmPassword, setPasswordErrors, "confirmPassword")}
              error={passwordErrors.confirmPassword}
              maxLength={LIMITS.password}
              autoComplete="new-password"
            />

            <ErrorAlert message={passwordError} />
            {passwordSaved && <Notice type="success">Password updated.</Notice>}

            <div className="form-actions">
              <button type="submit" className="btn btn-inline" disabled={savingPassword}>
                {savingPassword && <Spinner small />}
                {savingPassword ? "Updating..." : "Update password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
