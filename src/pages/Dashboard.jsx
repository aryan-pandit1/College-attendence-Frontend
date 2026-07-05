import { useState, useEffect } from "react";
import "./Dashboard.css";
// Adjust these imports to match your actual service files
import { getTimetable } from "../services/timetableService"; 
import { getCourses } from "../services/courseService";
import { addAttendance } from "../services/attendanceService";
import Skeleton from "../Components/Skeleton"; // 👈 Imported our new Skeleton component!

const Dashboard = ({ darkMode }) => {
  // 1. Added loading state to track when data is being fetched
  const [isLoading, setIsLoading] = useState(true);

  // Mock standard data matching your screenshot
  const [stats, setStats] = useState({
    attendancePercentage: 82.98,
    cgpa: 8.5,
    internals: 35,
    courses: 2,
    present: 39,
    absent: 8,
    totalClasses: 47,
  });

  const [todayClasses, setTodayClasses] = useState([]);

  // Fetch today's dynamic schedule from the backend timetable
  useEffect(() => {
    const fetchTodaySchedule = async () => {
      setIsLoading(true); // 👈 Start loading animation

      try {
        // Run both fetches simultaneously
        const [coursesRes, timetableRes] = await Promise.all([
          getCourses(),
          getTimetable()
        ]);

        const courses = coursesRes.data?.results || coursesRes.data || [];
        const timetable = timetableRes.data?.results || timetableRes.data || [];

        // Get the current day name (e.g., "Monday", "Tuesday")
        const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

        // Filter and merge course data with the timetable entry
        const todaySchedule = timetable
          .filter(entry => entry.day === currentDay)
          .map(entry => {
            const course = courses.find(c => c.id === entry.course);
            return {
              ...entry,
              courseName: course ? (course.course_name || course.name) : "Unknown Course",
              courseCode: course ? course.code : ""
            };
          })
          .sort((a, b) => a.start_time.localeCompare(b.start_time));

        setTodayClasses(todaySchedule);
      } catch (error) {
        console.error("Error fetching today's schedule:", error);
      } finally {
        setIsLoading(false); // 👈 Stop loading animation once done (or if it fails)
      }
    };

    fetchTodaySchedule();
  }, []);

  // Utility to truncate "09:00:00" to "09:00"
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.length > 5 ? timeStr.slice(0, 5) : timeStr;
  };

  // Quick mark attendance from the dashboard
  const handleQuickAttendance = async (courseId, status) => {
    try {
      await addAttendance({
        course: courseId,
        date: new Date().toISOString().split("T")[0],
        status: status === "present" ? "Present" : "Absent",
      });
      alert(`Successfully marked ${status}!`);
      // You can add logic here to refresh stats
    } catch (err) {
      console.error(err);
      alert("Failed to mark attendance.");
    }
  };

  return (
    <div className={`dashboard full-screen-layout ${darkMode ? "forced-dark" : ""}`}>
      
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, @aryan 👋</p>
        </div>
        <button className="reset-btn">RESET DATA</button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="stats-grid">
        <div className="card status-healthy text-center">
          <h3>OVERALL ATTENDANCE</h3>
          {/* 👈 Skeleton check for Circular Graph */}
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
              <Skeleton width="140px" height="140px" variant="circular" />
            </div>
          ) : (
            <div 
              className="circle dynamic-gauge" 
              style={{ "--progress-deg": `${(stats.attendancePercentage / 100) * 360}deg` }}
            >
              <span>{stats.attendancePercentage}%</span>
            </div>
          )}
          <p>GOOD STANDING</p>
        </div>

        <div className="card">
          <h3>CGPA</h3>
          <br/><br/>
          {isLoading ? <Skeleton width="100px" height="48px" /> : <><h2>{stats.cgpa}</h2><span className="label">/10</span></>}
        </div>

        <div className="card">
          <h3>AVERAGE INTERNALS</h3>
          <br/><br/>
          {isLoading ? <Skeleton width="100px" height="48px" /> : <><h2>{stats.internals}</h2><span className="label">/100</span></>}
        </div>

        <div className="card">
          <h3>TOTAL COURSES</h3>
          <br/><br/>
          {isLoading ? <Skeleton width="100px" height="48px" /> : <><h2>{stats.courses}</h2><span className="label">Courses</span></>}
        </div>
      </div>

      {/* Alert Notification */}
      <div className="alert-box">
        ✅ You can safely skip the next <b>5</b> classes.
      </div>

      {/* Main Bottom Grid */}
      <div className="dashboard-content">
        
        {/* Left Side: Dynamic Today's Schedule */}
        <div className="schedule-section">
          <h2>Today's Schedule</h2>
          
          {/* 👈 Skeleton check for Schedule Cards */}
          {isLoading ? (
            <>
              <div className="schedule-card" style={{ padding: 0, border: 'none' }}>
                <Skeleton width="100%" height="100px" borderRadius="16px" />
              </div>
              <div className="schedule-card" style={{ padding: 0, border: 'none' }}>
                <Skeleton width="100%" height="100px" borderRadius="16px" />
              </div>
            </>
          ) : todayClasses.length > 0 ? (
            todayClasses.map((cls) => (
              <div key={cls.id} className="schedule-card">
                <div>
                  <h4>{cls.courseName}</h4>
                  <p>
                    {formatTime(cls.start_time)} - {formatTime(cls.end_time)} 
                    {cls.room && ` • Room: ${cls.room}`}
                  </p>
                  {cls.courseCode && <small>{cls.courseCode}</small>}
                </div>
                <div className="attendance-buttons">
                  <button 
                    className="present-btn"
                    onClick={() => handleQuickAttendance(cls.course, "present")}
                  >
                    Mark Present
                  </button>
                  <button 
                    className="absent-btn"
                    onClick={() => handleQuickAttendance(cls.course, "absent")}
                  >
                    Mark Absent
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--text-muted)", fontWeight: "500", marginTop: "10px" }}>
              No classes scheduled for today. Enjoy your day!
            </p>
          )}
        </div>

        {/* Right Side: Overview Details */}
        <div className="right-panel">
          <div className="card">
            <h2>ATTENDANCE OVERVIEW</h2>
            
            {/* 👈 Skeleton check for Right Panel Elements */}
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', marginTop: '20px' }}>
                <Skeleton width="140px" height="140px" variant="circular" />
                <Skeleton width="100%" height="150px" borderRadius="12px" />
              </div>
            ) : (
              <>
                <div 
                  className="overview-circle dynamic-gauge" 
                  style={{ "--progress-deg": `${(stats.attendancePercentage / 100) * 360}deg` }}
                >
                  <span>{stats.attendancePercentage}%</span>
                </div>

                <ul className="overview-list">
                  <li>Present: <span>{stats.present}</span></li>
                  <li>Absent: <span>{stats.absent}</span></li>
                  <li>Total Classes: <span>{stats.totalClasses}</span></li>
                  <li>Courses: <span>{stats.courses}</span></li>
                </ul>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;