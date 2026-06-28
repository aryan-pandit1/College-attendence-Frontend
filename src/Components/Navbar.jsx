import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AddSubjectModal from "../pages/AddSubjectModal";

import {
  FaPlus,
  FaBell,
  FaCalendarAlt,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Navbar.css";

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const userName =
    localStorage.getItem("userName") || "Guest";

  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">🎓</span>

          <div>
            <h2>Academix</h2>
            <p>Your Academic Companion</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <NavLink to="/dashboard">
            Dashboard
          </NavLink>

          <NavLink to="/attendance">
            Attendance
          </NavLink>

          <NavLink to="/gpa">
            GPA Calculator
          </NavLink>

          <NavLink to="/internals">
            Internals
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Notifications */}
          <button className="icon-btn">
            <FaBell />
          </button>

          {/* Calendar */}
          <Link
            to="/calendar"
            className="icon-btn calendar-link"
          >
            <FaCalendarAlt />
          </Link>

          {/* Theme Toggle */}
          <button
            className="icon-btn"
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {darkMode ? (
              <FaSun />
            ) : (
              <FaMoon />
            )}
          </button>

          {/* Profile */}
          <div className="profile-wrapper">
            <div
              className="profile"
              onClick={() =>
                setShowMenu(!showMenu)
              }
            >
              <FaUserCircle className="profile-icon" />
              <span>{userName}</span>
            </div>

            {showMenu && (
              <div className="profile-menu">
                <button
                  onClick={() => {
                    alert(
                      "Profile page coming soon!"
                    );
                    setShowMenu(false);
                  }}
                >
                  <FaUserCircle />
                  My Profile
                </button>

                <button
  onClick={()=>{
      setShowMenu(false);
      setShowModal(true);
  }}
>
    <FaPlus/>
    Add Subject
</button>

                <button
                  onClick={() => {
                    alert(
                      "Settings page coming soon!"
                    );
                    setShowMenu(false);
                  }}
                >
                  <FaCog />
                  Settings
                </button>

                <button
                  onClick={() => {
                    setDarkMode(!darkMode);
                    setShowMenu(false);
                  }}
                >
                  {darkMode ? (
                    <>
                      <FaSun />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <FaMoon />
                      Dark Mode
                    </>
                  )}
                </button>

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Add Subject Modal */}
      {showModal && (
        <AddSubjectModal
          closeModal={() =>
            setShowModal(false)
          }
        />
      )}
      {showModal && (
    <AddSubjectModal
        closeModal={() => setShowModal(false)}
    />
)}
    </>
  );
};

export default Navbar;