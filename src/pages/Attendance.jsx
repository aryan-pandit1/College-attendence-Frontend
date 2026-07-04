import { useState, useEffect } from "react";
import { useSubjects } from "../context/SubjectContext";
import "./Attendance.css";

import {
  addAttendance,
  getPrediction,
} from "../services/attendanceService";

import axiosInstance from "../services/axiosInstance";

// FIXED: Accept darkMode prop sent directly down from App.jsx routing configuration
const Attendance = ({ darkMode }) => {
  const { subjects } = useSubjects();

  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    if (subjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects]);

  useEffect(() => {
    if (selectedSubjectId) {
      loadAttendance();
      loadPrediction();
    }
  }, [selectedSubjectId]);

  const loadAttendance = async () => {
    try {
      const res = await axiosInstance.get(
        `attendance/course/${selectedSubjectId}/`
      );
      setAttendanceLogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadPrediction = async () => {
    try {
      const res = await getPrediction(selectedSubjectId);
      setPrediction(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!Array.isArray(subjects)) return null;

  const selectedSubject = subjects.find(
    (s) => s.id === selectedSubjectId
  );

  // Fallback state context block adjustments
  if (subjects.length === 0) {
    return (
      <div className={`attendance-page ${darkMode ? "forced-dark" : ""}`}>
        <h2>No Subjects Added</h2>
        <p>Add a subject from Profile.</p>
      </div>
    );
  }

  if (!selectedSubject) return null;

  const present = attendanceLogs.filter(
    (a) => a.status === "Present"
  ).length;

  const absent = attendanceLogs.filter(
    (a) => a.status === "Absent"
  ).length;

  const totalClasses = present + absent;

  const attendancePercentage =
    totalClasses === 0
      ? 0
      : Math.round((present * 100) / totalClasses);

  const markAttendance = async (status) => {
    try {
      await addAttendance({
        course: selectedSubjectId,
        date: new Date().toISOString().split("T")[0],
        status: status === "present" ? "Present" : "Absent",
      });

      await loadAttendance();
      await loadPrediction();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteHistory = async (id) => {
    try {
      await axiosInstance.delete(`attendance/${id}/`);
      await loadAttendance();
      await loadPrediction();
    } catch (err) {
      console.log(err);
    }
  };

  const displayedHistory = showAllHistory
    ? attendanceLogs
    : attendanceLogs.slice(0, 5);

  return (
    /* FIXED: Dynamic context conditional string matches layout schema configurations */
    <div className={`attendance-page ${darkMode ? "forced-dark" : ""}`}>
      <div className="attendance-header">
        <h1>Attendance</h1>
      </div>

      <div className="subject-card expanded">
        <div className="subject-top">
          <div>
            <h2>{selectedSubject.name}</h2>
            <p>
              {selectedSubject.code} • {selectedSubject.credits} Credits
            </p>
          </div>

          <div className="attendance-value">
            <h3>
              {present}/{totalClasses}
            </h3>
            <span>{attendancePercentage}%</span>
          </div>
        </div>

        <div className="safe-box">
          <h4>
            {prediction?.status === "safe" ? (
              <>
                ✅ You can safely skip the next{" "}
                <b>{prediction.safe_bunks}</b> classes.
              </>
            ) : prediction ? (
              <>
                ⚠ Attend the next{" "}
                <b>{prediction.classes_needed}</b> classes continuously.
              </>
            ) : (
              "Loading prediction..."
            )}
          </h4>
          <p>Keep your attendance above the target percentage.</p>
        </div>

        <div className="progress-wrapper">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${attendancePercentage}%`,
              }}
            />
          </div>
          <span>{attendancePercentage}%</span>
        </div>

        <div className="attendance-count">
          <span>{present} Present</span>
          <span>{absent} Absent</span>
        </div>

        <div className="attendance-actions">
          <button
            className="present-btn"
            onClick={() => markAttendance("present")}
          >
            Mark Present
          </button>

          <button
            className="absent-btn"
            onClick={() => markAttendance("absent")}
          >
            Mark Absent
          </button>
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
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {displayedHistory.length > 0 ? (
                displayedHistory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>

                    <td>
                      {new Date(item.date).toLocaleDateString(
                        "en-US",
                        { weekday: "short" }
                      )}
                    </td>

                    <td className={item.status === "Present" ? "present" : "absent"}>
                      ● {item.status}
                    </td>

                    <td>Regular</td>

                    <td>
                      <button
                        className="delete-history-btn"
                        onClick={() => deleteHistory(item.id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    No attendance records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {attendanceLogs.length > 5 && (
            <div className="history-footer">
              <button
                className="read-more-btn"
                onClick={() => setShowAllHistory(!showAllHistory)}
              >
                {showAllHistory ? "Show Less ▲" : "Read More ▼"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="subject-list">
        <h2>Subjects</h2>

        {subjects.map((subject) => (
          <div
            key={subject.id}
            className={`subject-item ${
              selectedSubjectId === subject.id ? "active-subject" : ""
            }`}
            onClick={() => {
              setSelectedSubjectId(subject.id);
              setShowAllHistory(false);
            }}
          >
            <div>
              <h3>{subject.name}</h3>
              <p>
                {subject.code} • {subject.credits} Credits
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attendance;