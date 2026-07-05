import { useState, useEffect } from "react";
import "./Timetable.css";

import { getCourses } from "../services/courseService";

import {
  getTimetable,
  addTimetable,
  updateTimetable,
  deleteTimetable,
} from "../services/timetableService";

// 👇 Added Sunday to the days array here
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
  const [subjects, setSubjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    loadCourses();
    loadTimetable();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await getCourses();
      const data = res.data.results || res.data;
      setSubjects(data);

      if (data.length > 0) {
        setSelectedSemester(data[0].semester);
        setSelectedCourse(data[0].id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadTimetable = async () => {
    try {
      const res = await getTimetable();
      const data = res.data.results || res.data;
      setEntries(data);
    } catch (err) {
      console.log(err);
    }
  };

  const semesterSubjects = subjects.filter(
    (subject) => subject.semester === selectedSemester
  );

  useEffect(() => {
    if (semesterSubjects.length > 0) {
      setSelectedCourse(semesterSubjects[0].id);
    }
  }, [selectedSemester]);

  // -------------------------
  // Add Lecture
  // -------------------------
  const handleAddLecture = async () => {
    if (!selectedCourse || !startTime || !endTime) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await addTimetable({
        course: selectedCourse,
        day,
        start_time: startTime,
        end_time: endTime,
        room,
      });

      setStartTime("");
      setEndTime("");
      setRoom("");
      loadTimetable();
    } catch (err) {
      console.log(err);
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
  // Entries of Selected Semester
  // -------------------------
  const semesterEntries = entries.filter((entry) => {
    const course = subjects.find((sub) => sub.id === entry.course);
    if (!course) return false;
    return course.semester === selectedSemester;
  });

  // -------------------------
  // Helper
  // -------------------------
  const getCourseName = (courseId) => {
    const subject = subjects.find((sub) => sub.id === courseId);
    return subject ? subject.course_name : "";
  };

  // -------------------------
  // Group by Day
  // -------------------------
  const groupedTimetable = {};

  days.forEach((day) => {
    groupedTimetable[day] = semesterEntries
      .filter((entry) => entry.day === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  });

  return (
    <div className={`timetable-page ${darkMode ? "forced-dark" : ""}`}>
      <div className="timetable-header">
        <h1>Weekly Timetable</h1>
      </div>

      {/* Semester Selection */}
      <div className="semester-select">
        <label>Semester</label>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(Number(e.target.value))}
        >
          {[...new Set(subjects.map((s) => s.semester))].map((semester) => (
            <option key={semester} value={semester}>
              Semester {semester}
            </option>
          ))}
        </select>
      </div>

      {/* Add Lecture Card */}
      <div className="add-lecture-card">
        <h2>Add Lecture</h2>
        <div className="lecture-form">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
          >
            {semesterSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.course_name}
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
          />

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <input
            type="text"
            placeholder="Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <button onClick={handleAddLecture}>+ Add Lecture</button>
        </div>
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

                  <input
                    type="time"
                    value={entry.start_time}
                    onChange={(e) =>
                      handleUpdate(entry, "start_time", e.target.value)
                    }
                  />

                  <input
                    type="time"
                    value={entry.end_time}
                    onChange={(e) =>
                      handleUpdate(entry, "end_time", e.target.value)
                    }
                  />

                  <input
                    type="text"
                    value={entry.room}
                    onChange={(e) =>
                      handleUpdate(entry, "room", e.target.value)
                    }
                  />

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