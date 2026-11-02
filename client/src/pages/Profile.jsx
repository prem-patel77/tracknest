import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Two separate forms: one for name/email, one for the password.
export default function Profile() {
  const { user, setUser } = useAuth();

  // ----- Form 1: name and email -----
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [emailPassword, setEmailPassword] = useState(""); // only needed if the email changes
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  // Show the password box only when the email was edited
  const emailChanged = email.trim().toLowerCase() !== user.email;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    setSavingProfile(true);
    try {
      const res = await api.put("/auth/profile", {
        name,
        email,
        currentPassword: emailPassword,
      });
      setUser(res.data.user); // updates "Hi, name" in the navbar too
      setName(res.data.user.name);
      setEmail(res.data.user.email);
      setEmailPassword("");
      setProfileMsg({ type: "success", text: "Profile updated" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Could not update profile" });
    } finally {
      setSavingProfile(false);
    }
  };

  // ----- Form 2: password -----
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [savingPassword, setSavingPassword] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    // Check on the client first so the user gets instant feedback
    if (newPassword.length < 8) {
      return setPasswordMsg({ type: "error", text: "New password must be at least 8 characters" });
    }
    if (newPassword !== confirmPassword) {
      return setPasswordMsg({ type: "error", text: "New passwords do not match" });
    }

    setSavingPassword(true);
    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMsg({ type: "success", text: "Password updated" });
    } catch (err) {
      setPasswordMsg({ type: "error", text: err.response?.data?.message || "Could not update password" });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
      </div>

      <form className="form-card profile-card" onSubmit={handleProfileSubmit}>
        <h2>Account details</h2>
        {profileMsg.text && (
          <div className={profileMsg.type === "error" ? "alert-error" : "alert-success"}>
            {profileMsg.text}
          </div>
        )}

        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        {emailChanged && (
          <>
            <label htmlFor="emailPassword">Current password (needed to change your email)</label>
            <input
              id="emailPassword"
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </>
        )}

        <div className="form-actions">
          <button className="btn btn-inline" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      <form className="form-card profile-card" onSubmit={handlePasswordSubmit}>
        <h2>Change password</h2>
        {passwordMsg.text && (
          <div className={passwordMsg.type === "error" ? "alert-error" : "alert-success"}>
            {passwordMsg.text}
          </div>
        )}

        <label htmlFor="currentPassword">Current password</label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <label htmlFor="newPassword">New password</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <label htmlFor="confirmPassword">Confirm new password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <div className="form-actions">
          <button className="btn btn-inline" disabled={savingPassword}>
            {savingPassword ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}
