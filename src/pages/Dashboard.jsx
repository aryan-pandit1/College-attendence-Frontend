import { useEffect, useState, useContext } from "react";
import { getDashboard } from "../services/dashboardService";
import { addAttendance } from "../services/attendanceService";
import { useSubjects } from "../context/SubjectContext";
import { StudentContext } from "../context/StudentContext"; // ⚡ 1. Import Global Context
import { getSemesters } from "../services/academicService"; // ⚡ 2. Import Academic Service
import axiosInstance from "../services/axiosInstance"; // ⚡ 3. Imported to fetch course logs
import Skeleton from "../Components/Skeleton"; 
import { FaTrash, FaTimes } from "react-icons/fa";
import "./Dashboard.css";
import { deleteCourse } from "../services/courseService";

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
  const { currentSemesterId } = useContext(StudentContext) || {}; 
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [semesters, setSemesters] = useState([]); 
  
  // ⚡ CURRENT SEMESTER ATTENDANCE STATE
  const [currentSemStats, setCurrentSemStats] = useState({
    percentage: 0,
    present: 0,
    absent: 0,
    total: 0,
    courseCount: 0
  });
  
  // Modal State
  const [showCourseModal, setShowCourseModal] = useState(false);

  const [deadlines] = useState([
    { title: "DBMS Assignment", date: "May 18" },
    { title: "CN Lab Record", date: "May 20" },
    { title: "OS Quiz", date: "May 21" },
  ]);

  // ⚡ TRANSLATE DATABASE ID TO PHYSICAL NUMBER
  const activeSemObj = semesters.find(sem => String(sem.id) === String(currentSemesterId));
  const targetSemNumber = activeSemObj ? activeSemObj.semester_number : currentSemesterId;

  // ⚡ FILTER SUBJECTS STRICTLY FOR CURRENT SEMESTER
  const currentSemesterCourses = currentSemesterId
    ? subjects.filter((s) => {
        const semVal = s.semester_number || s.semester?.semester_number || s.semester || s.semester_id || s.semester?.id;
        return String(semVal) === String(currentSemesterId) || String(semVal) === String(targetSemNumber);
      })
    : subjects;

  useEffect(() => {
    const initDashboardData = async () => {
      try {
        const [dashRes, semRes] = await Promise.all([
          getDashboard(),
          getSemesters().catch(() => ({ data: [] }))
        ]);
        
        setDashboardData(dashRes.data);
        const semsList = semRes.data.results || semRes.data || [];
        setSemesters(semsList);
        
        const allClasses = dashRes.data?.today_schedule || [];
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
    initDashboardData();
  }, []);

  // ⚡ CALCULATE CURRENT SEMESTER ATTENDANCE EXCLUSIVELY
  useEffect(() => {
    const calculateActiveAttendance = async () => {
      if (!currentSemesterCourses || currentSemesterCourses.length === 0) {
        setCurrentSemStats({ percentage: 0, present: 0, absent: 0, total: 0, courseCount: 0 });
        return;
      }

      try {
        // Fetch logs for all current semester courses in parallel
        const logPromises = currentSemesterCourses.map(course => 
          axiosInstance.get(`attendance/course/${course.id}/`).catch(() => ({ data: [] }))
        );
        const results = await Promise.all(logPromises);

        let totalPresent = 0;
        let totalClasses = 0;

        results.forEach(res => {
          const logs = res.data || [];
          logs.forEach(log => {
            totalClasses += 1;
            if (log.status === "Present") totalPresent += 1;
          });
        });

        const percentage = totalClasses === 0 ? 0 : Math.round((totalPresent * 100) / totalClasses);
        
        setCurrentSemStats({
          percentage,
          present: totalPresent,
          absent: totalClasses - totalPresent,
          total: totalClasses,
          courseCount: currentSemesterCourses.length
        });
      } catch (err) {
        console.error("Error calculating active semester attendance:", err);
      }
    };

    if (!loading && subjects.length > 0) {
      calculateActiveAttendance();
    }
  }, [currentSemesterCourses.length, loading, subjects]);

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

  const coursesBySemester = subjects.reduce((acc, course) => {
    const sem = course.semester_number || course.semester?.semester_number || course.semester || "Other";
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(course);
    return acc;
  }, {});

  const handleDeleteCourse = async (courseId, courseName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${courseName}?`);
    if (!confirmDelete) return;

    try {
      await deleteCourse(courseId); 
      alert(`Successfully deleted ${courseName}!`);
      window.location.reload(); 
    } catch (error) {
      console.error("Backend Delete Error:", error);
      alert("Failed to delete course. Please check your network or backend logs.");
    }
  };

  if (error) return <h2 className="error-state">{error}</h2>;

  // ⚡ USE EXCLUSIVELY CURRENT SEMESTER STATS FOR THE DASHBOARD
  const attendanceRate = currentSemStats.percentage;
  const isLowAttendance = attendanceRate < 75;
  const cgpaValue = parseFloat(dashboardData?.cgpa) || 0;
  const isLowCgpa = cgpaValue < 6.0;

  return (
    <div className={`dashboard full-screen-layout ${darkMode ? "forced-dark" : ""}`}>
      {/* Header */}
      <header className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1>Dashboard</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            Welcome back, 
            {loading ? <Skeleton width="120px" height="18px" /> : `${dashboardData?.username || "Guest"} 👋`}
          </div>
        </div>
        
        {currentSemesterId && (
          <div>
            <span style={{ 
              fontSize: "0.85rem", 
              color: darkMode ? "#38bdf8" : "#2563eb", 
              fontWeight: "600",
              background: darkMode ? "rgba(56, 189, 248, 0.1)" : "rgba(37, 99, 235, 0.1)",
              padding: "6px 14px",
              borderRadius: "12px",
              display: "inline-block"
            }}>
              Active: Semester {targetSemNumber || currentSemesterId}
            </span>
          </div>
        )}
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className={`card attendance-card ${!loading && isLowAttendance ? "status-critical" : "status-healthy"}`}>
          <h3>Overall Attendance (Sem {targetSemNumber || currentSemesterId})</h3>
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

        <div 
          className="card clickable-card" 
          onClick={() => setShowCourseModal(true)}
          title="Click to view all courses"
        >
          <h3>Total Courses</h3>
          <br/><br/>
          {loading ? <Skeleton width="80px" height="48px" /> : <><h2>{dashboardData?.course_count}</h2><span>Courses</span></>}
          <p style={{ marginTop: "12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>👉 Click to view & manage</p>
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
            <>✅ Your active semester attendance is healthy at <strong>{attendanceRate}%</strong>. Keep it up!</>
          ) : (
            <>⚠️ Your Semester {targetSemNumber || currentSemesterId} attendance is below 75%. Attend upcoming classes.</>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="dashboard-content">
        
        {/* Left Side: Schedule */}
        <div className="schedule-section">
          <h2>Today's Schedule</h2>
          {loading ? (
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
            <h3>Attendance Overview (Sem {targetSemNumber || currentSemesterId})</h3>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Skeleton width="140px" height="140px" variant="circular" style={{margin: '20px 0'}} />
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
                  <li>Present: <span>{currentSemStats.present}</span></li>
                  <li>Absent: <span>{currentSemStats.absent}</span></li>
                  <li>Total Classes: <span>{currentSemStats.total}</span></li>
                  <li>Active Courses: <span>{currentSemStats.courseCount}</span></li>
                </ul>
              </>
            )}
          </div>

          <div className="card">
            <h3>Upcoming Deadlines</h3>
            {loading ? (
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

      {/* ALL COURSES MODAL OVERLAY */}
      {showCourseModal && (
        <div className="modal-overlay" onClick={() => setShowCourseModal(false)}>
          <div className="courses-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>My Courses</h2>
              <button className="close-btn" onClick={() => setShowCourseModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              {Object.keys(coursesBySemester).length === 0 ? (
                <p>No courses found. Add some to get started!</p>
              ) : (
                Object.keys(coursesBySemester).sort().map((sem) => {
                  const isCurrentSem = String(sem) === String(targetSemNumber) || String(sem) === String(currentSemesterId);
                  return (
                    <div 
                      key={sem} 
                      className="semester-group"
                      style={isCurrentSem ? {
                        border: `1px solid ${darkMode ? "#38bdf8" : "#2563eb"}`,
                        background: darkMode ? "rgba(56, 189, 248, 0.05)" : "rgba(37, 99, 235, 0.03)",
                        padding: "16px",
                        borderRadius: "12px",
                        marginBottom: "16px"
                      } : {}}
                    >
                      <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        Semester {sem} 
                        {isCurrentSem && (
                          <span style={{
                            fontSize: "0.75rem",
                            background: darkMode ? "#38bdf8" : "#2563eb",
                            color: "#ffffff",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontWeight: "700"
                          }}>
                            ★ Current Semester
                          </span>
                        )}
                      </h3>
                      <ul className="course-list">
                        {coursesBySemester[sem].map((course) => (
                          <li key={course.id} className="course-list-item">
                            <div className="course-info">
                              <strong>{course.name}</strong> 
                              <small className="course-code">({course.code})</small>
                            </div>
                            <button 
                              className="delete-icon-btn" 
                              title="Delete Course"
                              onClick={() => handleDeleteCourse(course.id, course.name)}
                            >
                              <FaTrash />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;