import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./Components/Navbar";
import { SubjectProvider } from "./context/SubjectContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Internals from "./pages/Internals";
import GPA from "./pages/GPA";
import Timetable from "./pages/Timetable";
import ProtectedRoute from "./Components/ProtectedRoute";
import Profile from "./pages/Profile";

function AppContent({ darkMode, setDarkMode }) {
  const location = useLocation();

  return (
   <>
  {location.pathname !== "/" && (
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
<Route path="/profile" element={<Profile darkMode={darkMode}/>} />
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
  </Routes>
</>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.className = darkMode
      ? "dark"
      : "light";

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <Router>
      <AppContent
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    </Router>
  );
}

export default App;