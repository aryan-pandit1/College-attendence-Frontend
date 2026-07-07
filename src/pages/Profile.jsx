import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUserCircle,
  FaCamera,
  FaEdit,
  FaLock,
  FaEnvelope,
  FaTrash,
  FaShieldAlt,
  FaQuestionCircle,
  FaHeadset,
  FaCommentDots,
  FaStar,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Profile.css";

import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword,
  deleteProfile,
} from "../services/profileService";

// Accept darkMode prop for the premium styling
const Profile = ({ darkMode }) => {
  const navigate = useNavigate();

  // -----------------------------
  // Popups
  // -----------------------------
  const [showLogout, setShowLogout] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // -----------------------------
  // User Details
  // -----------------------------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");

  // -----------------------------
  // Password
  // -----------------------------
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // -----------------------------
  // Verification
  // -----------------------------
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState(false);

  // -----------------------------
  // Privacy
  // -----------------------------
  const [privateAccount, setPrivateAccount] = useState(false);

  // -----------------------------
  // Load Profile
  // -----------------------------
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      const data = res.data;

      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setProfileImage(data.profile_image || "");
      setVerifiedEmail(data.email_verified || false);
      setVerifiedPhone(data.phone_verified || false);
      setPrivateAccount(data.private_account || false);
    } catch (err) {
      // Error handled cleanly internally
    }
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");

    navigate("/", { replace: true });
  };

  // -----------------------------
  // Save Profile
  // -----------------------------
  const saveProfile = async () => {
    try {
      await updateProfile({ name, email, phone });
      alert("Profile Updated Successfully");
      setEditing(false);
      loadProfile();
    } catch (err) {
      alert("Unable to update profile.");
    }
  };

  // -----------------------------
  // Upload Image
  // -----------------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      await uploadProfileImage(formData);
      loadProfile();
    } catch (err) {
      alert("Image upload failed.");
    }
  };

  // -----------------------------
  // Change Password
  // -----------------------------
  const savePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      alert("Password Changed Successfully");
      setShowPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("Password change failed.");
    }
  };

  // -----------------------------
  // Delete Account
  // -----------------------------
  const deleteAccount = async () => {
    if (!deletePassword) {
      alert("Please enter your password.");
      return;
    }

    try {
      await deleteProfile(deletePassword);
      alert("Account deleted successfully.");

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      navigate("/", { replace: true });
    } catch (err) {
      alert(err.response?.data?.error || "Incorrect password.");
    } finally {
      setDeletePassword("");
      setShowDelete(false);
    }
  };

  // -----------------------------
  // Privacy Toggle
  // -----------------------------
  const togglePrivacy = () => {
    setPrivateAccount(!privateAccount);
  };

  return (
    <div className={`profile-page ${darkMode ? "forced-dark" : ""}`}>
      <div className="profile-card">
        
        {/* ================= TOP HEADER ================= */}
        <div className="profile-top">
          <div
            className="profile-image"
            onClick={() => document.getElementById("profileUpload").click()}
            title="Change Profile Picture"
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-photo" />
            ) : (
              <FaUserCircle className="default-icon" />
            )}
          </div>

          <input
            id="profileUpload"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />

          <h2>{name || "Loading..."}</h2>
          <p>{email || "Email not added"}</p>
          <p style={{ marginTop: "4px" }}>{phone || "Phone not added"}</p>
        </div>

        {/* ================= CATEGORY 1: ACCOUNT SETTINGS ================= */}
        <div className="profile-section">
          <h3>Account Settings</h3>
          <div className="profile-options">
            <button onClick={() => setEditing(true)}>
              <FaEdit />
              <span>Edit Profile Info</span>
            </button>

            <button onClick={() => document.getElementById("profileUpload").click()}>
              <FaCamera />
              <span>Change Avatar</span>
            </button>

            <button onClick={() => setShowPassword(true)}>
              <FaLock />
              <span>Change Password</span>
            </button>

            <button>
              <FaEnvelope />
              <span>{verifiedEmail ? "Email Verified" : "Email Not Verified"}</span>
            </button>
          </div>
        </div>

        {/* ================= CATEGORY 2: APP PREFERENCES ================= */}
        <div className="profile-section">
          <h3>App Preferences</h3>
          <div className="profile-options">
            <button onClick={togglePrivacy}>
              <FaShieldAlt />
              <span>{privateAccount ? "Private Account" : "Public Account"}</span>
            </button>

            <button onClick={() => alert("Help Center Coming Soon.")}>
              <FaQuestionCircle />
              <span>Help Center</span>
            </button>

            <button onClick={() => window.open("mailto:support@studentcompanion.com")}>
              <FaHeadset />
              <span>Contact Support</span>
            </button>

            <button
              onClick={() => {
                const feedback = prompt("Enter your feedback");
                if (feedback) alert("Thank you for your feedback!");
              }}
            >
              <FaCommentDots />
              <span>Send Feedback</span>
            </button>

            <button
              onClick={() => {
                const rating = prompt("Rate us (1-5)");
                if (rating) alert("Thanks for rating us!");
              }}
            >
              <FaStar />
              <span>Rate App</span>
            </button>
          </div>
        </div>

        {/* ================= CATEGORY 3: DANGER ZONE ================= */}
        <div className="profile-section lifecycle-section">
          <h3>Account Actions</h3>
          <div className="profile-options">
            <button className="logout-btn" onClick={() => setShowLogout(true)}>
              <FaSignOutAlt />
              <span>Logout Securely</span>
            </button>

            <button className="delete-btn" onClick={() => setShowDelete(true)}>
              <FaTrash />
              <span>Delete Account Data</span>
            </button>
          </div>
        </div>

      </div>

      {/* ================= MODALS OVERLAYS ================= */}

      {/* EDIT PROFILE MODAL */}
      {editing && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Edit Profile</h3>
            <p>Update your personal information below.</p>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="logout-buttons">
              <button onClick={() => setEditing(false)}>Cancel</button>
              <button className="confirm" onClick={saveProfile}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPassword && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Change Password</h3>
            <p>Ensure your new password is at least 8 characters long.</p>

            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="logout-buttons">
              <button
                onClick={() => {
                  setShowPassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                Cancel
              </button>
              <button className="confirm" onClick={savePassword}>
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT MODAL */}
      {showDelete && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Delete Account?</h3>
            <p>This action is permanent and cannot be undone. All your data will be wiped.</p>

            <input
              type="password"
              placeholder="Enter your password to confirm"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />

            <div className="logout-buttons">
              <button
                onClick={() => {
                  setShowDelete(false);
                  setDeletePassword("");
                }}
              >
                Cancel
              </button>
              <button className="delete-btn" onClick={deleteAccount}>
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT MODAL */}
      {showLogout && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Ready to leave?</h3>
            <p>You will need to log back in to access your dashboard and data.</p>

            <div className="logout-buttons">
              <button onClick={() => setShowLogout(false)}>Cancel</button>
              <button className="confirm" onClick={handleLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;