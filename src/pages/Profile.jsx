import { useState } from "react";
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

const Profile = () => {
  const navigate = useNavigate();

  // -----------------------------
  // Popups
  // -----------------------------
  const [showLogout, setShowLogout] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // -----------------------------
  // User Details
  // -----------------------------
  const [name, setName] = useState(
    localStorage.getItem("userName") || "Guest"
  );

  const [email, setEmail] = useState(
    localStorage.getItem("email") || ""
  );

  const [phone, setPhone] = useState(
    localStorage.getItem("phone") || ""
  );

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  // -----------------------------
  // Password
  // -----------------------------
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  // -----------------------------
  // Verification Status
  // -----------------------------
  const [verifiedEmail, setVerifiedEmail] =
    useState(
      localStorage.getItem("verifiedEmail") ===
        "true"
    );

  const [verifiedPhone, setVerifiedPhone] =
    useState(
      localStorage.getItem("verifiedPhone") ===
        "true"
    );

  // -----------------------------
  // Privacy
  // -----------------------------
  const [privateAccount, setPrivateAccount] =
    useState(
      localStorage.getItem("privateAccount") ===
        "true"
    );

  // -----------------------------
  // Logout
  // -----------------------------
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/", { replace: true });
  };

  // -----------------------------
  // Save Profile
  // -----------------------------
  const saveProfile = () => {
    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    localStorage.setItem("userName", name);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);

    alert("Profile Updated Successfully");

    setEditing(false);
  };

  // -----------------------------
  // Change Password
  // -----------------------------
  const savePassword = () => {
    const savedPassword =
      localStorage.getItem("password") || "";

    if (savedPassword !== currentPassword) {
      alert("Current Password is incorrect.");
      return;
    }

    if (newPassword.length < 6) {
      alert(
        "Password should contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    localStorage.setItem(
      "password",
      newPassword
    );

    alert("Password Changed Successfully");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowPassword(false);
  };

  // -----------------------------
  // Delete Account
  // -----------------------------
  const deleteAccount = () => {
    const confirmDelete = window.confirm(
      "Delete your account permanently?"
    );

    if (!confirmDelete) return;

    localStorage.clear();

    alert("Account Deleted");

    navigate("/", { replace: true });
  };

  // -----------------------------
  // Verification
  // -----------------------------
  const verifyEmail = () => {
    localStorage.setItem(
      "verifiedEmail",
      "true"
    );

    setVerifiedEmail(true);

    alert("Email Verified");
  };

  const verifyPhone = () => {
    localStorage.setItem(
      "verifiedPhone",
      "true"
    );

    setVerifiedPhone(true);

    alert("Phone Verified");
  };

  // -----------------------------
  // Privacy
  // -----------------------------
  const togglePrivacy = () => {
    const value = !privateAccount;

    setPrivateAccount(value);

    localStorage.setItem(
      "privateAccount",
      value
    );
  };

    return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="profile-top">

          <div
  className="profile-image"
  onClick={() =>
    document.getElementById("profileUpload").click()
  }
  title="Change Profile Picture"
>
  {profileImage ? (
    <img
      src={profileImage}
      alt="Profile"
      className="profile-photo"
    />
  ) : (
    <FaUserCircle className="default-icon" />
  )}
</div>

          <h2>{name}</h2>

          <p>{email || "Email not added"}</p>

          <p>{phone || "Phone not added"}</p>

        </div>

        <div className="profile-options">

          {/* Edit Profile */}

          <button onClick={() => setEditing(true)}>
            <FaEdit />
            Edit Profile
          </button>

          {/* Change Profile Picture */}

          <button
            onClick={() =>
              document
                .getElementById("profileUpload")
                .click()
            }
          >
            <FaCamera />
            Change Profile Picture
          </button>

          <input
  id="profileUpload"
  type="file"
  accept="image/*"
  hidden
  onChange={(e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result;

      setProfileImage(image);

      localStorage.setItem("profileImage", image);

      window.dispatchEvent(
        new Event("profileUpdated")
      );
    };

    reader.readAsDataURL(file);
  }}
/>

<button
  onClick={() => {
    if (
      window.confirm(
        "Remove Profile Picture?"
      )
    ) {
      localStorage.removeItem("profileImage");
      setProfileImage("");
    }
  }}
>
  Remove Profile Picture
</button>

          {/* Password */}

          <button
            onClick={() =>
              setShowPassword(true)
            }
          >
            <FaLock />
            Change Password
          </button>

          {/* Verification */}

          <button
            onClick={() => {
              verifyEmail();
              verifyPhone();
            }}
          >
            <FaEnvelope />
            {verifiedEmail && verifiedPhone
              ? "Verified"
              : "Verify Email & Phone"}
          </button>

          {/* Privacy */}

          <button
            onClick={togglePrivacy}
          >
            <FaShieldAlt />
            {privateAccount
              ? "Private Account"
              : "Public Account"}
          </button>

          {/* Help */}

          <button
            onClick={() =>
              alert(
                "Help Center will be available soon."
              )
            }
          >
            <FaQuestionCircle />
            Help Center
          </button>

          {/* Contact */}

          <button
            onClick={() =>
              window.open(
                "mailto:support@studentcompanion.com"
              )
            }
          >
            <FaHeadset />
            Contact Support
          </button>

          {/* Feedback */}

          <button
            onClick={() => {
              const feedback =
                prompt(
                  "Enter your feedback"
                );

              if (feedback) {
                localStorage.setItem(
                  "feedback",
                  feedback
                );

                alert(
                  "Thanks for your feedback!"
                );
              }
            }}
          >
            <FaCommentDots />
            Send Feedback
          </button>

          {/* Rating */}

          <button
            onClick={() => {
              const rating =
                prompt(
                  "Rate the app (1-5)"
                );

              if (rating) {
                localStorage.setItem(
                  "rating",
                  rating
                );

                alert(
                  "Thank you for rating us!"
                );
              }
            }}
          >
            <FaStar />
            Rate the App
          </button>

          {/* Delete */}

          <button
            className="delete-btn"
            onClick={deleteAccount}
          >
            <FaTrash />
            Delete Account
          </button>

          {/* Logout */}

          <button
            className="logout-btn"
            onClick={() =>
              setShowLogout(true)
            }
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>
      </div>

      {/* ================= EDIT PROFILE POPUP ================= */}

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
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <div className="logout-buttons">
        <button onClick={() => setEditing(false)}>
          Cancel
        </button>

        <button
          className="confirm"
          onClick={() => {

            if (!name.trim()) {
              alert("Please enter your name.");
              return;
            }

            localStorage.setItem("userName", name);
            localStorage.setItem("email", email);
            localStorage.setItem("phone", phone);

            alert("Profile Updated Successfully!");

            setEditing(false);
          }}
        >
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
        onChange={(e) =>
          setCurrentPassword(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) =>
          setNewPassword(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(e.target.value)
        }
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

        <button
          className="confirm"
          onClick={() => {

            const savedPassword =
              localStorage.getItem("password") || "";

            if (currentPassword !== savedPassword) {
              alert("Current Password is incorrect.");
              return;
            }

            if (newPassword.length < 6) {
              alert("Password must be at least 6 characters.");
              return;
            }

            if (newPassword !== confirmPassword) {
              alert("Passwords do not match.");
              return;
            }

            localStorage.setItem("password", newPassword);

            alert("Password Changed Successfully!");

            setShowPassword(false);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
        >
          Save
        </button>

      </div>

    </div>
  </div>
)}

{/* ================= LOGOUT POPUP ================= */}

      {showLogout && (
        <div className="logout-overlay">
          <div className="logout-box">

            <h3>Logout</h3>

            <p>Are you sure you want to logout?</p>

            <div className="logout-buttons">

              <button
                onClick={() => setShowLogout(false)}
              >
                Cancel
              </button>

              <button
                className="confirm"
                onClick={handleLogout}
              >
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