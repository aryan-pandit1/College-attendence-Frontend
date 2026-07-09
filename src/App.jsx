import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import { SubjectProvider } from "./context/SubjectContext";
import { StudentProvider } from "./context/StudentContext"; 
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Internals from "./pages/Internals";
import GPA from "./pages/GPA";
import Timetable from "./pages/Timetable";
import ProtectedRoute from "./Components/ProtectedRoute";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import "./Styles/Global.css";
import About from "./pages/About";

function AppContent({ darkMode, setDarkMode }) {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/",
    "/forgot-password",
  ];

  const shouldHideNavbar =
    hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* --- GLOBAL ANIMATED BUBBLE BACKGROUND --- */}
      <div className="bubble-wrapper">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="bubble"></div>
        ))}
      </div>
      {/* ----------------------------------------- */}

      {!shouldHideNavbar && (
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<Login darkMode={darkMode}/>}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard darkMode={darkMode} />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={
  <ProtectedRoute>
  <Profile darkMode={darkMode}/>
  </ProtectedRoute>
  } />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance darkMode={darkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/internals"
          element={
            <ProtectedRoute>
              <Internals darkMode={darkMode}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gpa"
          element={
            <ProtectedRoute>
              <GPA darkMode={darkMode}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/timetable"
          element={
            <ProtectedRoute>
              <Timetable darkMode={darkMode}/>
            </ProtectedRoute>
          }
        />
        <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

       <Route
          path="/About"
          element={
            <ProtectedRoute>
              <About darkMode={darkMode}/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <StudentProvider> 
      <SubjectProvider>
        <Router>
          <AppContent
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </Router>
      </SubjectProvider>
    </StudentProvider>
  );
}

export default App;