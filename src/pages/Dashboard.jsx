import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import { addAttendance } from "../services/attendanceService";
import { useSubjects } from "../context/SubjectContext";
import Skeleton from "../Components/Skeleton"; 
import "./Dashboard.css";

// ==========================================
// ⚡ BULLETPROOF DAILY MEMORY SYSTEM
// ==========================================
const getDailyDate = () => {
  const d = new Date();
  return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
};

const getHiddenClasses = () => {
  const today = getDailyDate();
  const data = JSON.parse(localStorage.getItem("hiddenClasses") || "{}");
  return data.date === today ? (data.ids || []).map(String) : [];
};

const hideClassForToday = (uniqueId) => {
  if (!uniqueId) return;
  const today = getDailyDate();
  const hiddenIds = getHiddenClasses();
  const strId = String(uniqueId);
  
  if (!hiddenIds.includes(strId)) hiddenIds.push(strId);
  localStorage.setItem("hiddenClasses", JSON.stringify({ date: today, ids: hiddenIds }));
};

const unhideClass = (uniqueId) => {
  if (!uniqueId) return;
  const today = getDailyDate();
  const strId = String(uniqueId);
  
  const hiddenIds = getHiddenClasses().filter(id => id !== strId);
  localStorage.setItem("hiddenClasses", JSON.stringify({ date: today, ids: hiddenIds }));
};

// ==========================================
// MAIN COMPONENT
// ==========================================
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
        
        const allClasses = response.data?.today_schedule || [];
        const hiddenIds = getHiddenClasses();
        
        const visibleClasses = allClasses.filter((item) => {
          const uniqueId = item.id ? String(item.id) : String(item.course);
          return item.marked !== true && !hiddenIds.includes(uniqueId);
        });
        
        setSchedule(visibleClasses);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const markAttendance = async (item, status) => {
    const uniqueId = item.id ? String(item.id) : String(item.course);

    setSchedule((prev) => prev.filter((schedItem) => {
      const schedId = schedItem.id ? String(schedItem.id) : String(schedItem.course);
      return schedId !== uniqueId;
    }));
    hideClassForToday(uniqueId);

    try {
      const localDate = getDailyDate();
      let targetCourseId = item.course_id;
      
      if (!targetCourseId || isNaN(Number(targetCourseId))) {
        const cleanItemName = String(item.course).toLowerCase().trim();
        const matchedSubject = subjects.find((sub) => {
          const cleanSubName = String(sub.name).toLowerCase().trim();
          const cleanSubCode = String(sub.code).toLowerCase().trim();
          return cleanSubName === cleanItemName || cleanSubCode === cleanItemName;
        });
        if (matchedSubject) targetCourseId = matchedSubject.id;
      }

      if (isNaN(Number(targetCourseId))) {
        alert(`Frontend Error: I cannot find the ID for "${item.course}".`);
        throw new Error("Missing Numeric ID"); 
      }

      await addAttendance({
        course: targetCourseId,
        date: localDate,
        status: status === "present" ? "Present" : "Absent",
      });

      const freshData = await getDashboard();
      setDashboardData(freshData.data);

    } catch (error) {
      console.error("Dashboard Attendance Error:", error);
      if (error.response) alert(`Backend Error: ${JSON.stringify(error.response.data)}`);
      unhideClass(uniqueId);
      setSchedule((prev) => {
        const restoredSchedule = [...prev, item];
        return restoredSchedule.sort((a, b) => a.start_time.localeCompare(b.start_time));
      });
    }
  };

  const resetDashboard = () => {
    localStorage.removeItem("subjects");
    localStorage.removeItem("schedule");
    localStorage.removeItem("hiddenClasses"); 
    window.location.reload();
  };

  if (error) return <h2 className="error-state">{error}</h2>;

  const attendanceRate = dashboardData?.attendance_percentage || 0;
  const isLowAttendance = attendanceRate < 75;
  const cgpaValue = parseFloat(dashboardData?.cgpa) || 0;
  const isLowCgpa = cgpaValue < 6.0;

  return (
    <div className={`dashboard full-screen-layout ${darkMode ? "forced-dark" : ""}`}>
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            Welcome back, 
            {loading ? <Skeleton width="120px" height="18px" /> : `${dashboardData?.username || "Guest"} 👋`}
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className={`card attendance-card ${!loading && isLowAttendance ? "status-critical" : "status-healthy"}`}>
          <h3>Overall Attendance</h3>
          {loading ? (
             <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
               <Skeleton width="140px" height="140px" variant="circular" />
             </div>
          ) : (
            <div className="circle dynamic-gauge" style={{ "--progress-deg": `${(attendanceRate / 100) * 360}deg` }}>
              <span>{attendanceRate}%</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {loading ? <Skeleton width="100px" height="14px" /> : <p>{!isLowAttendance ? "Good Standing" : "Attendance Low"}</p>}
          </div>
        </div>

        <div className={`card cgpa-card ${!loading && isLowCgpa ? "status-critical" : "status-healthy"}`}>
          <h3>CGPA</h3>
          <br/><br/>
          {loading ? <Skeleton width="80px" height="48px" /> : <><h2 className={isLowCgpa ? "text-critical-force" : ""}>{dashboardData?.cgpa}</h2><span>/10</span></>}
        </div>

        <div className="card">
          <h3>Average Internals</h3>
          <br/><br/>
          {loading ? <Skeleton width="80px" height="48px" /> : <><h2>{dashboardData?.average_internals}</h2><span>/100</span></>}
        </div>

        <div className="card">
          <h3>Total Courses</h3>
          <br/><br/>
          {loading ? <Skeleton width="80px" height="48px" /> : <><h2>{dashboardData?.course_count}</h2><span>Courses</span></>}
        </div>
      </div>

      {/* Alert Notification */}
      {loading ? (
        <div className="alert-box" style={{ backgroundColor: "var(--bg-pill-tint)", borderColor: "var(--border-color)", borderLeftColor: "var(--text-muted)" }}>
          <Skeleton width="60%" height="20px" />
        </div>
      ) : (
        <div className={`alert-box ${isLowAttendance ? "alert-danger" : "alert-success"}`}>
          {!isLowAttendance ? (
            <>✅ You can safely skip the next <strong>{dashboardData?.safe_bunks}</strong> classes.</>
          ) : (
            <>⚠️ Your attendance is below 75%. Attend upcoming classes.</>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="dashboard-content">
        
        {/* Left Side: Schedule */}
        <div className="schedule-section">
          <h2>Today's Schedule</h2>
          {loading ? (
            /* 🔥 Text Skeletons inside actual cards! */
            <>
              {[1, 2].map((i) => (
                <div key={i} className="schedule-card">
                  <div>
                    <Skeleton width="160px" height="24px" style={{ marginBottom: "8px" }} />
                    <Skeleton width="120px" height="16px" style={{ marginBottom: "12px" }} />
                    <Skeleton width="60px" height="22px" borderRadius="8px" />
                  </div>
                  <div className="attendance-buttons">
                    <Skeleton width="90px" height="38px" borderRadius="8px" />
                    <Skeleton width="90px" height="38px" borderRadius="8px" />
                  </div>
                </div>
              ))}
            </>
          ) : schedule.length > 0 ? (
            schedule.map((item, index) => (
              <div key={item.id || index} className="schedule-card">
                <div>
                  <h4>{item.course}</h4>
                  <p>{item.start_time} - {item.end_time}</p>
                  <small>{item.room}</small>
                </div>
                <div className="attendance-buttons">
                  <button className="present-btn" onClick={() => markAttendance(item, "present")}>Present</button>
                  <button className="absent-btn" onClick={() => markAttendance(item, "absent")}>Absent</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--text-muted)", fontWeight: "600", fontSize: "1.1rem" }}>
              All caught up! No more classes scheduled for today. 🎉
            </p>
          )}
        </div>

        {/* Right Side: Panels */}
        <div className="right-panel">
          
          <div className="card">
            <h3>Attendance Overview</h3>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Skeleton width="140px" height="140px" variant="circular" style={{margin: '20px 0'}} />
                {/* 🔥 Text Skeletons for the list items! */}
                <ul className="overview-list" style={{ width: "100%" }}>
                  {[1, 2, 3, 4].map(i => (
                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Skeleton width="60px" height="16px" />
                      <Skeleton width="30px" height="16px" />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <div className="overview-circle dynamic-gauge" style={{ "--progress-deg": `${(attendanceRate / 100) * 360}deg` }}>
                  <div className="inner-circle">{attendanceRate}%</div>
                </div>
                <ul className="overview-list">
                  <li>Present: <span>{dashboardData?.present_classes}</span></li>
                  <li>Absent: <span>{dashboardData?.absent_classes}</span></li>
                  <li>Total Classes: <span>{dashboardData?.total_classes}</span></li>
                  <li>Courses: <span>{dashboardData?.course_count}</span></li>
                </ul>
              </>
            )}
          </div>

          <div className="card">
            <h3>Upcoming Deadlines</h3>
            {loading ? (
              /* 🔥 Text Skeletons for deadlines */
              <ul className="deadlines">
                {[1, 2].map(i => (
                  <li key={i}>
                    <Skeleton width="140px" height="18px" style={{ marginBottom: "6px" }} />
                    <br />
                    <Skeleton width="80px" height="14px" />
                  </li>
                ))}
              </ul>
            ) : deadlines.length > 0 ? (
              <ul className="deadlines">
                {deadlines.map((item, index) => (
                  <li key={index}><strong>{item.title}</strong><br /><small>{item.date}</small></li>
                ))}
              </ul>
            ) : (
              <p>No upcoming deadlines.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;