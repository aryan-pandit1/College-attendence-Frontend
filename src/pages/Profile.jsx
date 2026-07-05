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

const Profile = () => {
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

    navigate("/", {
      replace: true,
    });
  };

  // -----------------------------
  // Save Profile
  // -----------------------------
  const saveProfile = async () => {
    try {
      await updateProfile({
        name,
        email,
        phone,
      });

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

      navigate("/", {
        replace: true,
      });
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
    <div className="profile-page">
      <div className="profile-card">
        {/* ================= TOP ================= */}
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

          <h2>{name}</h2>
          <p>{email || "Email not added"}</p>
          <p>{phone || "Phone not added"}</p>
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="profile-options">
          <button onClick={() => setEditing(true)}>
            <FaEdit />
            Edit Profile
          </button>

          <button onClick={() => document.getElementById("profileUpload").click()}>
            <FaCamera />
            Change Profile Picture
          </button>

          <button onClick={() => setShowPassword(true)}>
            <FaLock />
            Change Password
          </button>

          <button>
            <FaEnvelope />
            {verifiedEmail ? "Email Verified" : "Email Not Verified"}
          </button>

          <button onClick={togglePrivacy}>
            <FaShieldAlt />
            {privateAccount ? "Private Account" : "Public Account"}
          </button>

          <button onClick={() => alert("Help Center Coming Soon.")}>
            <FaQuestionCircle />
            Help Center
          </button>

          <button onClick={() => window.open("mailto:support@studentcompanion.com")}>
            <FaHeadset />
            Contact Support
          </button>

          <button
            onClick={() => {
              const feedback = prompt("Enter your feedback");
              if (!feedback) return;
              alert("Thank you for your feedback!");
            }}
          >
            <FaCommentDots />
            Send Feedback
          </button>

          <button
            onClick={() => {
              const rating = prompt("Rate us (1-5)");
              if (!rating) return;
              alert("Thanks for rating us!");
            }}
          >
            <FaStar />
            Rate App
          </button>

          <button className="delete-btn" onClick={() => setShowDelete(true)}>
            <FaTrash />
            Delete Account
          </button>

          <button className="logout-btn" onClick={() => setShowLogout(true)}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      {/* ================= EDIT PROFILE ================= */}
      {editing && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Edit Profile</h3>

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="logout-buttons">
              <button onClick={() => setEditing(false)}>Cancel</button>
              <button className="confirm" onClick={saveProfile}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CHANGE PASSWORD ================= */}
      {showPassword && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Change Password</h3>

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
              placeholder="Confirm Password"
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE ACCOUNT ================= */}
      {showDelete && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Delete Account</h3>
            <p>This action cannot be undone.</p>

            <input
              type="password"
              placeholder="Enter your password"
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= LOGOUT ================= */}
      {showLogout && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Logout</h3>
            <p>Are you sure you want to logout?</p>

            <div className="logout-buttons">
              <button onClick={() => setShowLogout(false)}>Cancel</button>
              <button className="confirm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;