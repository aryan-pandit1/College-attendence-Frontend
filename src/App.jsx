import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./Components/Navbar";
import { SubjectProvider } from "./context/SubjectContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Internals from "./pages/Internals";
import GPA from "./pages/GPA";
import Calendar from "./pages/Calendar";
import ProtectedRoute from "./Components/ProtectedRoute";

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
      element={<Login />}
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/attendance"
      element={
        <ProtectedRoute>
          <Attendance />
        </ProtectedRoute>
      }
    />

    <Route
      path="/internals"
      element={
        <ProtectedRoute>
          <Internals />
        </ProtectedRoute>
      }
    />

    <Route
      path="/gpa"
      element={
        <ProtectedRoute>
          <GPA />
        </ProtectedRoute>
      }
    />

    <Route
      path="/calendar"
      element={
        <ProtectedRoute>
          <Calendar />
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