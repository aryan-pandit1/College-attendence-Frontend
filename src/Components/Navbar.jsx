import { useState, useContext, useEffect, useRef } from "react";
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
  FaInfoCircle, 
  FaCalendar
} from "react-icons/fa";

import "./Navbar.css";

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { student } = useContext(StudentContext);

  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ⚡ 1. MUST BE INSIDE THE NAVBAR FUNCTION: Create the dropdown reference
  const dropdownRef = useRef(null);

  // ⚡ 2. MUST BE INSIDE THE NAVBAR FUNCTION: Click-outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showMenu]);

  // SMART AUTO-HIDE STATES
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // SCROLL & MOUSE DIRECTION LISTENER ENGINE
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
          <button className="icon-btn" onClick={() => alert("Notifications")}>
            <FaBell />
          </button>

          {/* ⚡ PREMIUM CALENDAR LOGO PILL IN NAVBAR */}
         <Link to="/calendar" className="icon-btn" title="Academic Calendar">
    <FaCalendar />
  </Link>

          <Link to="/timetable" className="icon-btn calendar-link" title="Timetable">
            <FaTable />
          </Link>

          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* ⚡ 3. Attach dropdownRef to this profile-wrapper div */}
          <div className="profile-wrapper" ref={dropdownRef}>
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
                <div className="mobile-dropdown-icons">
                  <button onClick={() => { setDarkMode(!darkMode); setShowMenu(false); }}>
                    {darkMode ? <><FaSun /> Light Mode</> : <><FaMoon /> Dark Mode</>}
                  </button>
                  {/* ⚡ Added Mobile Calendar Link */}
                  <button onClick={() => { navigate("/calendar"); setShowMenu(false); }}>
                    <FaCalendar /> Calendar
                  </button>
                  <button onClick={() => { navigate("/timetable"); setShowMenu(false); }}>
                    <FaTable /> Timetable
                  </button>
                  <button onClick={() => { alert("Notifications"); setShowMenu(false); }}>
                    <FaBell /> Notifications
                  </button>
                </div>

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