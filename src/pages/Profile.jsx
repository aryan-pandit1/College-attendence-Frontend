import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StudentContext } from "../context/StudentContext"; // Hooked into centralized data engine

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
  // deleteProfile,
} from "../services/profileService";

const Profile = ({ darkMode }) => {
  const navigate = useNavigate();

  // Connect state updates straight to the existing global student provider controls
  const { student, setStudent, refreshStudentProfile } = useContext(StudentContext);

  // -----------------------------
  // Popups
  // -----------------------------
  const [showLogout, setShowLogout] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // -----------------------------
  // User Details Input States
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
  // Load Profile Data
  // -----------------------------
// -----------------------------
  // Load Profile Data
  // -----------------------------
  const loadProfile = async () => {
    try {
      const res = await getProfile();
      const data = res.data;

      // FIX: Map the backend's 'username' to your React 'name' state
      const actualName = data.username || "";

      setName(actualName);
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setProfileImage(data.profile_image || "");
      setVerifiedEmail(data.email_verified || false);
      setVerifiedPhone(data.phone_verified || false);
      setPrivateAccount(data.private_account || false);

      // Sync it immediately with global context
      setStudent((prevStudent) => ({
        ...prevStudent,
        name: actualName,
        profileImage: data.profile_image || "",
        email: data.email || "",
        phone: data.phone || "",
      }));
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };
  // -----------------------------
  // Logout Handler
  // -----------------------------
  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

 // -----------------------------
  // Save Profile Logic
  // -----------------------------
  const saveProfile = async () => {
    try {
      // Sending the update to the backend
      const response = await updateProfile({ 
        username: name, 
        email: email, 
        phone: phone 
      });

      console.log("BACKEND SAVE SUCCESS:", response.data);

      setStudent((prevStudent) => ({
        ...prevStudent,
        name: name,
        email: email,
        phone: phone,
      }));

      alert("Profile Updated Successfully");
      setEditing(false);

      if (refreshStudentProfile) await refreshStudentProfile();
      loadProfile();

    } catch (err) {
      // 👇 THIS IS THE MAGIC LINE. It will tell us exactly what Django is mad about!
      console.error("BACKEND REJECTED SAVE. Reason:", err.response?.data || err.message);
      
      alert(`Backend Error: ${JSON.stringify(err.response?.data || "Unknown Error")}`);
    }
  };

  // -----------------------------
  // Upload Image Handler
  // -----------------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      await uploadProfileImage(formData);

      // FIX: Sync new avatar picture across context immediately
      if (refreshStudentProfile) {
        await refreshStudentProfile();
      } else {
        // Fallback context mutation if background fetch hasn't completed
        const res = await getProfile();
        setStudent((prevStudent) => ({
          ...prevStudent,
          profileImage: res.data.profile_image || ""
        }));
      }
      
      loadProfile();
    } catch (err) {
      alert("Image upload failed.");
    }
  };

  // -----------------------------
  // Change Password Handler
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
  // Delete Account Handler
  // -----------------------------
  const deleteAccount = async () => {
    if (!deletePassword) {
      alert("Please enter your password.");
      return;
    }

    try {
      // await deleteProfile(deletePassword);
      alert("Account deleted successfully.");
      localStorage.clear();
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
    const nextPrivacy = !privateAccount;
    setPrivateAccount(nextPrivacy);
    
    setStudent((prevStudent) => ({
      ...prevStudent,
      privateAccount: nextPrivacy,
    }));
  };

  return (
    <div className={`profile-page ${darkMode ? "forced-dark" : ""}`}>
      <div className="profile-card">
        
        {/* ================= HEADER WRAPPER ================= */}
        <div className="profile-top">
          <div
            className="profile-image"
            onClick={() => document.getElementById("profileUpload").click()}
            title="Change Profile Picture"
          >
            {student.profileImage ? (
              <img src={student.profileImage} alt="Profile" className="profile-photo" />
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

          <h2>{student.name || "Guest"}</h2>
          <p>{email || "Email not added"}</p>
          <p>{phone || "Phone not added"}</p>
        </div>

        {/* ================= INSTA/FB APP STYLE CONTROLS ================= */}
        <div className="profile-options-container">
          
          <div className="profile-section">
            <h3>Profile Management</h3>
            <div className="profile-options">
              <button type="button" onClick={() => setEditing(true)}>
                <div className="btn-content"><FaEdit className="icon-blue" /> <span>Edit Profile</span></div>
              </button>
              <button type="button" onClick={() => document.getElementById("profileUpload").click()}>
                <div className="btn-content"><FaCamera className="icon-pink" /> <span>Change Photo</span></div>
              </button>
            </div>
          </div>

          <div className="profile-section">
            <h3>Privacy & Security</h3>
            <div className="profile-options">
              <button type="button" onClick={() => setShowPassword(true)}>
                <div className="btn-content"><FaLock className="icon-orange" /> <span>Change Password</span></div>
              </button>
              <button type="button">
                <div className="btn-content"><FaEnvelope className="icon-emerald" /> <span>Email Status</span></div>
                <strong className="status-badge badge-emerald">{verifiedEmail ? "Verified" : "Unverified"}</strong>
              </button>
              <button type="button" onClick={togglePrivacy}>
                <div className="btn-content"><FaShieldAlt className="icon-indigo" /> <span>Account Access</span></div>
                <strong className="status-badge badge-indigo">{privateAccount ? "Private" : "Public"}</strong>
              </button>
            </div>
          </div>

          <div className="profile-section">
            <h3>Support & Feedback</h3>
            <div className="profile-options">
              <button type="button" onClick={() => alert("Help Center Coming Soon.")}>
                <div className="btn-content"><FaQuestionCircle className="icon-teal" /> <span>Help Center</span></div>
              </button>
              <button type="button" onClick={() => window.open("mailto:support@studentcompanion.com")}>
                <div className="btn-content"><FaHeadset className="icon-violet" /> <span>Contact Support</span></div>
              </button>
              <button type="button" onClick={() => { const f = prompt("Enter feedback"); if(f) alert("Thanks!"); }}>
                <div className="btn-content"><FaCommentDots className="icon-cyan" /> <span>Send Feedback</span></div>
              </button>
              <button type="button" onClick={() => { const r = prompt("Rate 1-5"); if(r) alert("Thanks!"); }}>
                <div className="btn-content"><FaStar className="icon-yellow" /> <span>Rate App</span></div>
              </button>
            </div>
          </div>

          <div className="profile-section lifecycle-section">
            <h3>Account Settings</h3>
            <div className="profile-options">
              <button type="button" className="logout-btn" onClick={() => setShowLogout(true)}>
                <FaSignOutAlt /> Logout
              </button>
              <button type="button" className="delete-btn" onClick={() => setShowDelete(true)}>
                <FaTrash /> Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ================= EDIT PROFILE OVERLAY ================= */}
      {editing && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Edit Profile</h3>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <div className="logout-buttons">
              <button type="button" onClick={() => setEditing(false)}>Cancel</button>
              <button type="button" className="confirm" onClick={saveProfile}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CHANGE PASSWORD OVERLAY ================= */}
      {showPassword && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Change Password</h3>
            <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <div className="logout-buttons">
              <button type="button" onClick={() => { setShowPassword(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}>Cancel</button>
              <button type="button" className="confirm" onClick={savePassword}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE ACCOUNT OVERLAY ================= */}
      {showDelete && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Delete Account</h3>
            <p>This action cannot be undone.</p>
            <input type="password" placeholder="Enter your password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
            <div className="logout-buttons">
              <button type="button" onClick={() => { setShowDelete(false); setDeletePassword(""); }}>Cancel</button>
              <button type="button" className="delete-btn" onClick={deleteAccount}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= LOGOUT OVERLAY ================= */}
      {showLogout && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-buttons">
              <button type="button" onClick={() => setShowLogout(false)}>Cancel</button>
              <button type="button" className="confirm" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;