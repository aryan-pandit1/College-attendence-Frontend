import { useState, useContext, useEffect } from "react"; // ⚡ Added useEffect
import { Link, NavLink, useNavigate } from "react-router-dom";
import AddSubjectModal from "../pages/AddSubjectModal";

// FIXED: Changed path from SubjectContext to your actual StudentContext file
import { StudentContext } from "../context/StudentContext"; 

import {
  FaPlus,
  FaBell,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaCog,
  FaSignOutAlt,
  FaTable,
  FaInfoCircle 
} from "react-icons/fa";

import "./Navbar.css";

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  // Hook into your student data state pool safely
  const { student } = useContext(StudentContext);

  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ⚡ 1. SMART AUTO-HIDE STATES
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // ⚡ 2. SCROLL & MOUSE DIRECTION LISTENER ENGINE
  useEffect(() => {
    // Graceful exit for mobile screens to keep layout perfectly stable
    if (window.innerWidth <= 768) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // HIDE if scrolling downwards past a baseline threshold
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
        setShowMenu(false); // Clean utility fallback: snaps dropdown close if user flies down page
      } 
      // SHOW instantly upon any upward thumb traction
      else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    const handleMouseMove = (e) => {
      // BUMPER MECHANIC: Drops down automatically if cursor touches top 60px viewport threshold
      if (e.clientY < 60) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  return (
    <>
      {/* ⚡ 3. DYNAMICALLY APPLIED HIDING CLASS */}
      <nav className={`navbar ${darkMode ? "dark" : ""} ${!isVisible ? "nav-hidden" : ""}`}>
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
            to="/timetable"
            className="icon-btn calendar-link"
          >
            <FaTable />
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

          {/* Profile Wrapper */}
          <div className="profile-wrapper">
            <div
              className="profile"
              onClick={() => setShowMenu(!showMenu)}
            >
              {student.profileImage ? (
                <img
                  src={student.profileImage}
                  alt="Profile"
                  className="navbar-profile-image"
                  style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <FaUserCircle className="profile-icon" />
              )}

              <span>{student.name || "Guest"}</span>
            </div>
            
            {showMenu && (
              <div className="profile-menu">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/profile");
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
                  onClick={() => {
                    navigate("/about");
                    setShowMenu(false);
                  }}
                >
                  <FaInfoCircle />
                  <span>About</span>
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
    </>
  );
};

export default Navbar;