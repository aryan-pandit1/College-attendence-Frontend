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
import { getSemesters } from "../services/academicService";

import "./Profile.css";

import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword,
  deleteProfile,
} from "../services/profileService";

const Profile = ({ darkMode }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [semesters, setSemesters] = useState([]);
  const [currentSemester, setCurrentSemester] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [profileRes, semesterRes] = await Promise.all([
        getProfile(),
        getSemesters(),
      ]);

      const profile = profileRes.data;
      
      // DEBUG LOG: Check your browser console to see what Django is actually sending!
      console.log("Profile Data from Django:", profile);

      setName(profile.name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      
      // Extract the ID safely
      const semData = profile.current_semester;
      const semId = typeof semData === 'object' && semData !== null ? semData.id : semData;
      setCurrentSemester(semId || "");

      setSemesters(semesterRes.data.results || semesterRes.data || []);
      setProfileImage(profile.profile_image || "");

      setVerifiedEmail(profile.email_verified || false);
      setVerifiedPhone(profile.phone_verified || false);
      setPrivateAccount(profile.private_account || false);
    } catch (err) { 
      console.log(err);
    }
  };

  const getSemesterDisplay = () => {
    if (!currentSemester) return "Semester not set";
    const sem = semesters.find((s) => String(s.id) === String(currentSemester));
    return sem ? `Semester ${sem.semester_number}` : "Semester not set";
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    navigate("/", { replace: true });
  };

  const saveProfile = async () => {
    try {
      const parsedSemester = currentSemester ? parseInt(currentSemester, 10) : null;

      // ⚡ THE DUAL PAYLOAD HACK: 
      // Sends both field names so Django REST Framework accepts it no matter how your backend is configured!
      const payload = { 
        name, 
        email, 
        phone, 
        current_semester: parsedSemester,
        current_semester_id: parsedSemester 
      };

      await updateProfile(payload);

      alert("Profile Updated Successfully");
      setEditing(false);
      loadProfile(); // Reload from Django
    } catch (err) {
      alert("Unable to update profile. Please check your inputs.");
      console.log("Save error:", err.response?.data || err);
    }
  };

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

  const savePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      alert("Password Changed Successfully");
      setShowPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("Password change failed.");
    }
  };

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

  const togglePrivacy = () => setPrivateAccount(!privateAccount);

   // ⚡ SKELETON RENDER BLOCK
  if (isLoading) {
    return (
      <div className={`profile-page ${darkMode ? "forced-dark" : ""}`}>
        <div className="profile-card">
          <div className="profile-top">
            <div className="skeleton-avatar skeleton-pulse"></div>
            <div className="skeleton-text skeleton-title skeleton-pulse"></div>
            <div className="skeleton-text skeleton-pulse"></div>
            <div className="skeleton-text skeleton-pulse" style={{ width: "40%" }}></div>
            <div className="skeleton-badge skeleton-pulse"></div>
          </div>

          <div className="profile-section">
            <div className="skeleton-section-title skeleton-pulse"></div>
            <div className="profile-options">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-button skeleton-pulse"></div>
              ))}
            </div>
          </div>
          
          <div className="profile-section">
            <div className="skeleton-section-title skeleton-pulse"></div>
            <div className="profile-options">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-button skeleton-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          
          {/* SEMESTER BADGE */}
          <p style={{ 
            marginTop: "8px", 
            fontWeight: "700", 
            color: darkMode ? "#38bdf8" : "#2563eb",
            background: darkMode ? "rgba(56, 189, 248, 0.1)" : "rgba(37, 99, 235, 0.1)",
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "0.85rem"
          }}>
            {getSemesterDisplay()}
          </p>
        </div>

        {/* ================= ACCOUNT SETTINGS ================= */}
        <div className="profile-section">
          <h3>Account Settings</h3>
          <div className="profile-options">
            <button onClick={() => setEditing(true)}><FaEdit /><span>Edit Profile Info</span></button>
            <button onClick={() => document.getElementById("profileUpload").click()}><FaCamera /><span>Change Avatar</span></button>
            <button onClick={() => setShowPassword(true)}><FaLock /><span>Change Password</span></button>
            <button><FaEnvelope /><span>{verifiedEmail ? "Email Verified" : "Email Not Verified"}</span></button>
          </div>
        </div>

        {/* ================= APP PREFERENCES ================= */}
        <div className="profile-section">
          <h3>App Preferences</h3>
          <div className="profile-options">
            <button onClick={togglePrivacy}><FaShieldAlt /><span>{privateAccount ? "Private Account" : "Public Account"}</span></button>
            <button onClick={() => alert("Help Center Coming Soon.")}><FaQuestionCircle /><span>Help Center</span></button>
            <button onClick={() => window.open("mailto:support@studentcompanion.com")}><FaHeadset /><span>Contact Support</span></button>
            <button onClick={() => { const fb = prompt("Enter your feedback"); if (fb) alert("Thank you!"); }}><FaCommentDots /><span>Send Feedback</span></button>
            <button onClick={() => { const r = prompt("Rate us (1-5)"); if (r) alert("Thanks!"); }}><FaStar /><span>Rate App</span></button>
          </div>
        </div>

        {/* ================= DANGER ZONE ================= */}
        <div className="profile-section lifecycle-section">
          <h3>Account Actions</h3>
          <div className="profile-options">
            <button className="logout-btn" onClick={() => setShowLogout(true)}><FaSignOutAlt /><span>Logout Securely</span></button>
            <button className="delete-btn" onClick={() => setShowDelete(true)}><FaTrash /><span>Delete Account Data</span></button>
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

            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            
            <div style={{ marginTop: "6px", textAlign: "left" }}>
              {/* ⚡ STRICT STRING COERCION ON DROPDOWN */}
              <select
                value={currentSemester ? String(currentSemester) : ""}
                onChange={(e) => setCurrentSemester(e.target.value)}
                style={{
                  width: "100%", padding: "16px", borderRadius: "12px",
                  border: `1px solid ${darkMode ? "var(--border-color)" : "#e2e8f0"}`,
                  background: darkMode ? "var(--profile-bg)" : "#ffffff",
                  color: darkMode ? "var(--text-main)" : "#0f172a",
                  fontSize: "15px", outline: "none", cursor: "pointer", marginBottom: "16px"
                }}
              >
                <option value="">Select Current Semester</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={String(semester.id)}>
                    Semester {semester.semester_number}
                  </option>
                ))}
              </select>
            </div>

            <div className="logout-buttons">
              <button onClick={() => setEditing(false)}>Cancel</button>
              <button className="confirm" onClick={saveProfile}>Save Changes</button>
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
            <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <div className="logout-buttons">
              <button onClick={() => { setShowPassword(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}>Cancel</button>
              <button className="confirm" onClick={savePassword}>Update Password</button>
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
            <input type="password" placeholder="Enter your password to confirm" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
            <div className="logout-buttons">
              <button onClick={() => { setShowDelete(false); setDeletePassword(""); }}>Cancel</button>
              <button className="delete-btn" onClick={deleteAccount}>Permanently Delete</button>
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
              <button className="confirm" onClick={handleLogout}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;