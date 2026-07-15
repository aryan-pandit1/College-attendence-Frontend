import { useState, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AddSubjectModal from "../pages/AddSubjectModal";
import { StudentContext } from "../context/StudentContext"; 

import {
  FaPlus,
  FaBell,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaCog,
  FaTable,
  FaInfoCircle 
} from "react-icons/fa";

import "./Navbar.css";

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { student } = useContext(StudentContext);

  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 1. SMART AUTO-HIDE STATES
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 2. SCROLL & MOUSE DIRECTION LISTENER ENGINE
  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
        setShowMenu(false); 
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    const handleMouseMove = (e) => {
      if (e.clientY < 60) setIsVisible(true);
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
      <nav className={`navbar ${darkMode ? "dark" : ""} ${!isVisible ? "nav-hidden" : ""}`}>
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">🎓</span>
          <div>
            <h2>Semtrek</h2>
            <p>Your Academic Companion</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/attendance">Attendance</NavLink>
          <NavLink to="/gpa">GPA Calculator</NavLink>
          <NavLink to="/internals">Internals</NavLink>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          
          {/* ⚡ DESKTOP ICONS (Hidden on mobile via CSS) */}
          <button className="icon-btn" onClick={() => alert("Notifications")}>
            <FaBell />
          </button>

          <Link to="/timetable" className="icon-btn calendar-link">
            <FaTable />
          </Link>

          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* Profile Wrapper */}
          <div className="profile-wrapper">
            <div className="profile" onClick={() => setShowMenu(!showMenu)}>
              {student?.profileImage ? (
                <img
                  src={student.profileImage}
                  alt="Profile"
                  className="navbar-profile-image"
                  style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <FaUserCircle className="profile-icon" />
              )}
              <span>{student?.name || "Guest"}</span>
            </div>
            
            {showMenu && (
              <div className="profile-menu">
                
                {/* ⚡ MOBILE ONLY ICONS (Visible only on phones via CSS) */}
                <div className="mobile-dropdown-icons">
                  <button onClick={() => { setDarkMode(!darkMode); setShowMenu(false); }}>
                    {darkMode ? <><FaSun /> Light Mode</> : <><FaMoon /> Dark Mode</>}
                  </button>
                  <button onClick={() => { navigate("/timetable"); setShowMenu(false); }}>
                    <FaTable /> Timetable
                  </button>
                  <button onClick={() => { alert("Notifications"); setShowMenu(false); }}>
                    <FaBell /> Notifications
                  </button>
                </div>

                {/* DEFAULT MENU ITEMS (Visible everywhere) */}
                <button onClick={() => { setShowMenu(false); navigate("/profile"); }}>
                  <FaUserCircle /> My Profile
                </button>

                <button onClick={() => { setShowMenu(false); setShowModal(true); }}>
                  <FaPlus /> Add Subject
                </button>

                <button onClick={() => { setShowMenu(false); alert("Settings page coming soon!"); }}>
                  <FaCog /> Settings
                </button>

                <button onClick={() => { setShowMenu(false); navigate("/about"); }}>
                  <FaInfoCircle /> <span>About</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showModal && <AddSubjectModal closeModal={() => setShowModal(false)} />}
    </>
  );
};

export default Navbar;