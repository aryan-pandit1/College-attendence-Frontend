import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import "./Dashboard.css";
import { useSubjects } from "../context/SubjectContext";

// Accept the darkMode prop passed down from App.jsx
const Dashboard = ({ darkMode }) => {
  const { subjects } = useSubjects();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState([]);

  const [deadlines] = useState([
    { title: "DBMS Assignment", date: "May 18" },
    { title: "CN Lab Record", date: "May 20" },
    { title: "OS Quiz", date: "May 21" },
  ]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        setDashboardData(response.data);
        setSchedule(response.data?.today_schedule || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const markAttendance = (id, status) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, marked: true, status } : item
      )
    );
  };

  const resetDashboard = () => {
    localStorage.removeItem("subjects");
    localStorage.removeItem("schedule");
    window.location.reload();
  };

  if (loading) return <h2 className="loading-state">Loading Dashboard...</h2>;
  if (error) return <h2 className="error-state">{error}</h2>;

  const attendanceRate = dashboardData.attendance_percentage || 0;
  const isLowAttendance = attendanceRate < 75;

  const cgpaValue = parseFloat(dashboardData.cgpa) || 0;
  const isLowCgpa = cgpaValue < 6.0;

  return (
    /* Consumes the darkMode prop directly to force immediate white/dark switching */
    <div className={`dashboard full-screen-layout ${darkMode ? "forced-dark" : ""}`}>
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {dashboardData.username || "Guest"} 👋</p>
        </div>
        <button className="reset-btn" onClick={resetDashboard}>
          Reset Data
        </button>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className={`card attendance-card ${isLowAttendance ? "status-critical" : "status-healthy"}`}>
          <h3>Overall Attendance</h3>
          <div 
            className="circle dynamic-gauge" 
            style={{ 
              "--progress-deg": `${(attendanceRate / 100) * 360}deg` 
            }}
          >
            <span>{attendanceRate}%</span>
          </div>
          <p>{!isLowAttendance ? "Good Standing" : "Attendance Low"}</p>
        </div>

        <div className={`card cgpa-card ${isLowCgpa ? "status-critical" : "status-healthy"}`}>
          <h3>CGPA</h3>
          <h2 className={isLowCgpa ? "text-critical-force" : ""}>{dashboardData.cgpa}</h2>
          <span>/10</span>
        </div>

        <div className="card">
          <h3>Average Internals</h3>
          <h2>{dashboardData.average_internals}</h2>
          <span>/100</span>
        </div>

        <div className="card">
          <h3>Total Courses</h3>
          <h2>{dashboardData.course_count}</h2>
          <span>Courses</span>
        </div>
      </div>

      {/* Attendance Alert */}
      <div className={`alert-box ${isLowAttendance ? "alert-danger" : "alert-success"}`}>
        {!isLowAttendance ? (
          <>
            ✅ You can safely skip the next <strong>{dashboardData.safe_bunks}</strong> classes.
          </>
        ) : (
          <>
            ⚠️ Your attendance is below 75%. Attend upcoming classes.
          </>
        )}
      </div>

      <div className="dashboard-content">
        {/* Today's Schedule */}
        <div className="schedule-section">
          <h2>Today's Schedule</h2>
          {schedule.length > 0 ? (
            schedule.map((item, index) => (
              <div key={item.id || index} className="schedule-card">
                <div>
                  <h4>{item.course}</h4>
                  <p>{item.start_time} - {item.end_time}</p>
                  <small>{item.room}</small>
                </div>

                <div className="attendance-buttons">
                  {item.marked ? (
                    <span className={item.status === "present" ? "marked-present" : "marked-absent"}>
                      {item.status === "present" ? "● Present" : "● Absent"}
                    </span>
                  ) : (
                    <>
                      <button className="present-btn" onClick={() => markAttendance(item.id, "present")}>
                        Present
                      </button>
                      <button className="absent-btn" onClick={() => markAttendance(item.id, "absent")}>
                        Absent
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No classes scheduled for today.</p>
          )}
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          {/* Attendance Overview */}
          <div className="card">
            <h3>Attendance Overview</h3>
            <div 
              className="overview-circle dynamic-gauge"
              style={{ 
                "--progress-deg": `${(attendanceRate / 100) * 360}deg` 
              }}
            >
              <div className="inner-circle">{attendanceRate}%</div>
            </div>
            <ul className="overview-list">
              <li>Present: <span>{dashboardData.present_classes}</span></li>
              <li>Absent: <span>{dashboardData.absent_classes}</span></li>
              <li>Total Classes: <span>{dashboardData.total_classes}</span></li>
              <li>Courses: <span>{dashboardData.course_count}</span></li>
            </ul>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card">
            <h3>Upcoming Deadlines</h3>
            {deadlines.length > 0 ? (
              <ul className="deadlines">
                {deadlines.map((item, index) => (
                  <li key={index}>
                    <strong>{item.title}</strong>
                    <br />
                    <small>{item.date}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming deadlines.</p>
            )}
          </div>

          {/* Subject Overview */}
          <div className="card">
            <h3>Subject Overview</h3>
            {subjects && subjects.length === 0 ? (
              <p>No subjects added.</p>
            ) : (
              <div className="subject-overview">
                {subjects?.map((subject) => {
                  const total = subject.attendance.present + subject.attendance.absent;
                  const percentage = total === 0 ? 0 : Math.round((subject.attendance.present / total) * 100);
                  return (
                    <div key={subject.id} className="subject-summary">
                      <div>
                        <h4>{subject.name}</h4>
                        <small>{subject.code}</small>
                      </div>
                      <span className={percentage < 75 ? "badge-low" : "badge-good"}>
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;