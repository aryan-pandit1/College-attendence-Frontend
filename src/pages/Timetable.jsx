import { useState, useEffect, useContext } from "react";
import "./Timetable.css";
import { StudentContext } from "../context/StudentContext";
import { getCourses } from "../services/courseService";
import { getSemesters } from "../services/academicService"; 
import {
  getTimetable,
  addTimetable,
  updateTimetable,
  deleteTimetable,
} from "../services/timetableService";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Timetable = ({ darkMode }) => {
  const { currentSemesterId } = useContext(StudentContext) || {};

  const [subjects, setSubjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState(""); // ⚡ RESTORED: endTime state
  const [room, setRoom] = useState("");

  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    loadCourses();
    loadTimetable();
    loadSemestersList();
  }, []);

  const loadSemestersList = async () => {
    try {
      const res = await getSemesters();
      const data = res.data.results || res.data || [];
      setSemesters(data);
    } catch (err) {
      console.error("Failed to load semesters for mapping:", err);
    }
  };

  const loadCourses = async () => {
    try {
      const res = await getCourses();
      const data = res.data.results || res.data || [];
      setSubjects(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTimetable = async () => {
    try {
      const res = await getTimetable();
      const data = res.data.results || res.data || [];
      setEntries(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ⚡ TRANSLATE DATABASE ID TO PHYSICAL NUMBER
  const activeSemObj = semesters.find((sem) => String(sem.id) === String(currentSemesterId));
  const targetSemNumber = activeSemObj ? activeSemObj.semester_number : currentSemesterId;

  // ⚡ UNIVERSAL COURSE FILTER
  const semesterSubjects = currentSemesterId
    ? subjects.filter((subject) => {
        const semVal = subject.semester_number || subject.semester?.semester_number || subject.semester || subject.semester_id || subject.semester?.id;
        return String(semVal) === String(currentSemesterId) || String(semVal) === String(targetSemNumber);
      })
    : subjects;

  useEffect(() => {
    if (semesterSubjects.length > 0) {
      const exists = semesterSubjects.some((s) => String(s.id) === String(selectedCourse));
      if (!exists) {
        setSelectedCourse(semesterSubjects[0].id);
      }
    } else {
      setSelectedCourse("");
    }
  }, [semesterSubjects, selectedCourse]);

  // -------------------------
  // Add Lecture
  // -------------------------
  const handleAddLecture = async () => {
    // ⚡ RESTORED: Validate both startTime and endTime
    if (!selectedCourse || !startTime || !endTime) {
      alert("Please select a course, start time, and end time.");
      return;
    }

    try {
      await addTimetable({
        course: Number(selectedCourse),
        day,
        start_time: startTime,
        end_time: endTime, // ⚡ RESTORED: Send end_time to Django to prevent 400 error
        room,
      });

      setStartTime("");
      setEndTime(""); // Reset endTime
      setRoom("");
      loadTimetable();
    } catch (err) {
      console.error("Error adding lecture:", err.response?.data || err.message);
      if (err.response?.data) {
        alert(`Server Rejected Request:\n${JSON.stringify(err.response.data, null, 2)}`);
      } else {
        alert("Failed to add lecture. Please check console.");
      }
    }
  };

  // -------------------------
  // Delete Lecture
  // -------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lecture?")) return;

    try {
      await deleteTimetable(id);
      loadTimetable();
    } catch (err) {
      console.log(err);
    }
  };

  // -------------------------
  // Update Lecture
  // -------------------------
  const handleUpdate = async (entry, field, value) => {
    try {
      await updateTimetable(entry.id, {
        ...entry,
        [field]: value,
      });
      loadTimetable();
    } catch (err) {
      console.log(err);
    }
  };

  // -------------------------
  // Entries of Current Semester ONLY
  // -------------------------
  const semesterEntries = entries.filter((entry) => {
    const course = subjects.find((sub) => String(sub.id) === String(entry.course));
    if (!course) return false;
    
    if (!currentSemesterId) return true;
    const semVal = course.semester_number || course.semester?.semester_number || course.semester || course.semester_id || course.semester?.id;
    return String(semVal) === String(currentSemesterId) || String(semVal) === String(targetSemNumber);
  });

  const getCourseName = (courseId) => {
    const subject = subjects.find((sub) => String(sub.id) === String(courseId));
    return subject ? (subject.course_name || subject.name) : "";
  };

  const groupedTimetable = {};

  days.forEach((day) => {
    groupedTimetable[day] = semesterEntries
      .filter((entry) => entry.day === day)
      .sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
  });

  return (
    <div className={`timetable-page ${darkMode ? "forced-dark" : ""}`}>
      
      {/* HEADER WITH DYNAMIC SEMESTER BADGE */}
      <div 
        className="timetable-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}
      >
        <div>
          <h1>Weekly Timetable</h1>
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

      {/* Add Lecture Card */}
      <div className="add-lecture-card">
        <h2>Add Lecture</h2>
        {semesterSubjects.length === 0 ? (
          <p style={{ color: darkMode ? "#94a3b8" : "#64748b", margin: "12px 0" }}>
            No courses found for Semester {targetSemNumber || currentSemesterId}. Please add courses first.
          </p>
        ) : (
          <div className="lecture-form">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
            >
              {semesterSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.course_name || subject.name}
                </option>
              ))}
            </select>

            <select value={day} onChange={(e) => setDay(e.target.value)}>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              title="Start Time"
            />

            {/* ⚡ RESTORED: End Time Input */}
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              title="End Time"
            />

            <input
              type="text"
              placeholder="Room / Hall"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />

            <button onClick={handleAddLecture}>+ Add Lecture</button>
          </div>
        )}
      </div>

      {/* Weekly Timetable Grid */}
      <div className="week-grid">
        {days.map((day) => (
          <div key={day} className="day-card">
            <h2>{day}</h2>

            {groupedTimetable[day].length === 0 ? (
              <p>No lectures scheduled</p>
            ) : (
              groupedTimetable[day].map((entry) => (
                <div key={entry.id} className="lecture-card">
                  <h4>{getCourseName(entry.course)}</h4>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center", margin: "8px 0" }}>
                    <span style={{ fontSize: "0.8rem", color: darkMode ? "#94a3b8" : "#64748b", fontWeight: "600" }}>
                      Start:
                    </span>
                    <input
                      type="time"
                      value={entry.start_time}
                      onChange={(e) =>
                        handleUpdate(entry, "start_time", e.target.value)
                      }
                      style={{ flex: 1 }}
                    />
                  </div>

                  {/* ⚡ RESTORED: End Time Grid Input */}
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", margin: "8px 0" }}>
                    <span style={{ fontSize: "0.8rem", color: darkMode ? "#94a3b8" : "#64748b", fontWeight: "600" }}>
                      End:
                    </span>
                    <input
                      type="time"
                      value={entry.end_time || ""}
                      onChange={(e) =>
                        handleUpdate(entry, "end_time", e.target.value)
                      }
                      style={{ flex: 1 }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "0.8rem", color: darkMode ? "#94a3b8" : "#64748b", fontWeight: "600" }}>
                      Room:
                    </span>
                    <input
                      type="text"
                      placeholder="Room"
                      value={entry.room || ""}
                      onChange={(e) =>
                        handleUpdate(entry, "room", e.target.value)
                      }
                      style={{ flex: 1 }}
                    />
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;