import { useState, useEffect, useContext } from "react";
import { useSubjects } from "../context/SubjectContext";
import { StudentContext } from "../context/StudentContext";
import "./Attendance.css";
import { addAttendance, getPrediction } from "../services/attendanceService";
import axiosInstance from "../services/axiosInstance";
import Skeleton from "../Components/Skeleton";
import { getSemesters } from "../services/academicService";

const Attendance = ({ darkMode }) => {
  const { subjects } = useSubjects();
  const { currentSemesterId } = useContext(StudentContext) || {};

  const [isLoading, setIsLoading] = useState(true);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  // 1. FETCH SEMESTERS TO MAP ID TO NUMBER
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const fetchSemestersList = async () => {
      try {
        const res = await getSemesters();
        const data = res.data.results || res.data || [];
        setSemesters(data);
      } catch (err) {
        console.error("Failed to fetch semesters for mapping:", err);
      }
    };
    fetchSemestersList();
  }, []);

  // 2. TRANSLATE DATABASE ID TO PHYSICAL SEMESTER NUMBER
  const activeSemObj = semesters.find(sem => String(sem.id) === String(currentSemesterId));
  const targetSemNumber = activeSemObj ? activeSemObj.semester_number : currentSemesterId;

  // 3. UNIVERSAL COURSE FILTER (Matches either ID or Number)
  const displayedSubjects = currentSemesterId
    ? subjects.filter((s) => {
      const semVal = s.semester_number || s.semester?.semester_number || s.semester || s.semester_id || s.semester?.id;
      return String(semVal) === String(currentSemesterId) || String(semVal) === String(targetSemNumber);
    })
    : subjects;

  // 4. AUTO-SELECT FIRST SUBJECT OF THE CURRENT SEMESTER
  useEffect(() => {
    if (displayedSubjects?.length > 0) {
      const exists = displayedSubjects.some((s) => String(s.id) === String(selectedSubjectId));
      if (!exists) {
        setSelectedSubjectId(displayedSubjects[0].id);
      }
    } else {
      setSelectedSubjectId(null);
    }
  }, [displayedSubjects, currentSemesterId, selectedSubjectId]);

  useEffect(() => {
    if (selectedSubjectId) {
      fetchAttendanceData();
    }
  }, [selectedSubjectId]);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const [attRes, predRes] = await Promise.all([
        axiosInstance.get(`attendance/course/${selectedSubjectId}/`),
        getPrediction(selectedSubjectId)
      ]);
      setAttendanceLogs(attRes.data);
      setPrediction(predRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create Manual Attendance (timetable == null on backend)
  const markAttendance = async (status) => {
    try {
      await addAttendance({
        course: selectedSubjectId,
        date: new Date().toISOString().split("T")[0],
        status: status === "present" ? "Present" : "Absent",
      });
      fetchAttendanceData();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle status via PATCH (Present <-> Absent) without creating a new record
  const updateAttendanceStatus = async (item) => {
    try {
      const newStatus = item.status === "Present" ? "Absent" : "Present";
      await axiosInstance.patch(`attendance/${item.id}/`, {
        status: newStatus,
      });
      fetchAttendanceData();
    } catch (err) {
      console.error(err);
      alert("Failed to update attendance status.");
    }
  };

  // Delete attendance record cleanly via DELETE
  const deleteHistory = async (item) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) {
      return;
    }

    try {
      await axiosInstance.delete(`attendance/${item.id}/`);
      fetchAttendanceData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete attendance record.");
    }
  };

  if (!Array.isArray(subjects) || subjects.length === 0) {
    return (
      <div className={`attendance-page ${darkMode ? "forced-dark" : ""}`}>
        <h2>No Subjects Added</h2>
        <p>Add a subject from your Profile or Dashboard.</p>
      </div>
    );
  }

  const selectedSubject = displayedSubjects.find(s => String(s.id) === String(selectedSubjectId));

  const present = attendanceLogs.filter(a => a.status === "Present").length;
  const absent = attendanceLogs.filter(a => a.status === "Absent").length;
  const totalClasses = present + absent;
  const attendancePercentage = totalClasses === 0 ? 0 : Math.round((present * 100) / totalClasses);
  const displayedHistory = showAllHistory ? attendanceLogs : attendanceLogs.slice(0, 5);

  return (
    <div className={`attendance-page ${darkMode ? "forced-dark" : ""}`}>
      <div
        className="attendance-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}
      >
        <div>
          <h1>Attendance</h1>
          {currentSemesterId && (
            <span style={{
              fontSize: "0.85rem",
              color: darkMode ? "#38bdf8" : "#2563eb",
              fontWeight: "600",
              background: darkMode ? "rgba(56, 189, 248, 0.1)" : "rgba(37, 99, 235, 0.1)",
              padding: "4px 12px",
              borderRadius: "12px",
              display: "inline-block",
              marginTop: "4px"
            }}>
              Showing Current Semester Only (Sem {targetSemNumber || currentSemesterId})
            </span>
          )}
        </div>
      </div>

      {!selectedSubject ? (
        <div className="subject-card expanded" style={{ textAlign: "center", padding: "40px" }}>
          <h3>No subjects found for Semester {targetSemNumber || currentSemesterId}.</h3>
          <p style={{ color: darkMode ? "#94a3b8" : "#64748b", marginTop: "8px" }}>
            Please enroll in courses for your current semester or change your active semester in your Profile settings.
          </p>
        </div>
      ) : (
        <div className="subject-card expanded">
          {isLoading ? (
            <>
              <div className="subject-top">
                <div>
                  <Skeleton width="180px" height="32px" />
                  <br />
                  <Skeleton width="120px" height="16px" />
                </div>
                <div className="attendance-value">
                  <Skeleton width="80px" height="32px" />
                  <br />
                  <Skeleton width="40px" height="20px" />
                </div>
              </div>

              <br />
              <Skeleton width="100%" height="70px" borderRadius="12px" />
              <br />

              <div className="progress-wrapper">
                <Skeleton width="100%" height="12px" borderRadius="20px" />
              </div>

              <div className="attendance-actions" style={{ marginTop: '24px' }}>
                <Skeleton width="130px" height="42px" borderRadius="8px" />
                <Skeleton width="130px" height="42px" borderRadius="8px" />
              </div>

              <br /><br />
              <Skeleton width="200px" height="24px" />
              <br />
              <Skeleton width="100%" height="250px" borderRadius="12px" />
            </>
          ) : (
            <>
              <div className="subject-top">
                <div>
                  <h2>{selectedSubject.name}</h2>
                  <p>{selectedSubject.code} • {selectedSubject.credits} Credits</p>
                </div>
                <div className="attendance-value">
                  <h3>{present}/{totalClasses}</h3>
                  <span>{attendancePercentage}%</span>
                </div>
              </div>

              <div className="safe-box">
                <h4>
                  {prediction?.status === "safe" ? (
                    <>✅ You can safely skip the next <b>{prediction.safe_bunks}</b> classes.</>
                  ) : prediction ? (
                    <>⚠ Attend the next <b>{prediction.classes_needed}</b> classes continuously.</>
                  ) : (
                    "Loading prediction..."
                  )}
                </h4>
                <p>Keep your attendance above the target percentage.</p>
              </div>

              <div className="progress-wrapper">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${attendancePercentage}%` }} />
                </div>
                <span>{attendancePercentage}%</span>
              </div>

              <div className="attendance-count">
                <span>{present} Present</span>
                <span>{absent} Absent</span>
              </div>

              <div className="attendance-actions">
                <button className="present-btn" onClick={() => markAttendance("present")}>Mark Present</button>
                <button className="absent-btn" onClick={() => markAttendance("absent")}>Mark Absent</button>
              </div>

              <div className="history-section">
                <h3>Attendance History</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th className="action-header">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedHistory.length > 0 ? (
                      displayedHistory.map((item) => {
                        const isAuto = item.timetable !== null && item.timetable !== undefined;
                        const timeDisplay = isAuto && item.start_time && item.end_time
                          ? `Automatic (${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)})`
                          : "Manual";

                        return (
                          <tr key={item.id}>
                            <td>{item.date}</td>
                            <td>{new Date(item.date).toLocaleDateString("en-US", { weekday: "short" })}</td>
                            <td>
                              <div className={`status-badge ${item.status === "Present" ? "present" : "absent"}`}>
                                {item.status}
                              </div>
                            </td>
                            <td>
                              <span className={`type-badge ${isAuto ? "auto-type" : "manual-type"}`}>
                                {isAuto ? "⚡ " : "✍️ "}
                                {timeDisplay}
                              </span>
                            </td>
                            <td className="action-cell">
                              <div className="action-button-group">
                                <button
                                  className="edit-history-btn"
                                  onClick={() => updateAttendanceStatus(item)}
                                  title={`Change status to ${item.status === "Present" ? "Absent" : "Present"}`}
                                >
                                  {item.status === "Present" ? "Mark Absent" : "Mark Present"}
                                </button>

                                <button
                                  className="delete-history-btn"
                                  onClick={() => deleteHistory(item)}
                                  title="Delete this record"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr><td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>No attendance records available.</td></tr>
                    )}
                  </tbody>
                </table>

                {attendanceLogs.length > 5 && (
                  <div className="history-footer">
                    <button className="read-more-btn" onClick={() => setShowAllHistory(!showAllHistory)}>
                      {showAllHistory ? "Show Less ▲" : "Read More ▼"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="subject-list">
        <h2>Subjects</h2>
        {displayedSubjects.length > 0 ? (
          displayedSubjects.map((subject) => (
            <div
              key={subject.id}
              className={`subject-item ${String(selectedSubjectId) === String(subject.id) ? "active-subject" : ""}`}
              onClick={() => {
                setSelectedSubjectId(subject.id);
                setShowAllHistory(false);
              }}
            >
              <div>
                <h3>{subject.name}</h3>
                <p>{subject.code} • {subject.credits} Credits</p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>No subjects found for Semester {targetSemNumber || currentSemesterId}.</p>
        )}
      </div>
    </div>
  );
};

export default Attendance;