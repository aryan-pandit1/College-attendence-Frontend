import { useState, useEffect } from "react";
import { useSubjects } from "../context/SubjectContext";
import "./Attendance.css";

const Attendance = () => {
  const { subjects, editSubject } = useSubjects();

  const [selectedSubjectId, setSelectedSubjectId] =
    useState(null);

  const [showAllHistory, setShowAllHistory] =
    useState(false);

  // Automatically select first subject
  useEffect(() => {
    if (
      subjects.length > 0 &&
      selectedSubjectId === null
    ) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  const selectedSubject = subjects.find(
    (subject) =>
      subject.id === selectedSubjectId
  );

  if (subjects.length === 0) {
    return (
      <div className="attendance-page">
        <h2>No Subjects Added</h2>
        <p>
          Add a subject from the Profile →
          Add Subject option.
        </p>
      </div>
    );
  }

  if (!selectedSubject) return null;

  const totalClasses =
    selectedSubject.attendance.present +
    selectedSubject.attendance.absent;

  const attendancePercentage =
    totalClasses === 0
      ? 0
      : Math.round(
          (selectedSubject.attendance.present /
            totalClasses) *
            100
        );

  const safeToSkip = Math.max(
    0,
    Math.floor(
      (
        selectedSubject.attendance.present -
        0.75 * totalClasses
      ) / 0.75
    )
  );

  // Mark attendance
  const markAttendance = (status) => {
    const present =
      status === "present"
        ? selectedSubject.attendance.present +
          1
        : selectedSubject.attendance.present;

    const absent =
      status === "absent"
        ? selectedSubject.attendance.absent +
          1
        : selectedSubject.attendance.absent;

    const total = present + absent;

    editSubject(selectedSubject.id, {
      attendance: {
        ...selectedSubject.attendance,
        present,
        absent,
        percentage:
          total === 0
            ? 0
            : Math.round(
                (present / total) * 100
              ),
        history: [
          {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            day: new Date().toLocaleDateString(
              "en-US",
              {
                weekday: "short",
              }
            ),
            status:
              status === "present"
                ? "Present"
                : "Absent",
            type: "Regular",
          },
          ...selectedSubject.attendance.history,
        ],
      },
    });
  };

  // Delete history
  const deleteHistory = (historyId) => {
    const removed =
      selectedSubject.attendance.history.find(
        (item) => item.id === historyId
      );

    if (!removed) return;

    let present =
      selectedSubject.attendance.present;

    let absent =
      selectedSubject.attendance.absent;

    if (removed.status === "Present") {
      present = Math.max(0, present - 1);
    } else {
      absent = Math.max(0, absent - 1);
    }

    const updatedHistory =
      selectedSubject.attendance.history.filter(
        (item) => item.id !== historyId
      );

    const total = present + absent;

    editSubject(selectedSubject.id, {
      attendance: {
        ...selectedSubject.attendance,
        present,
        absent,
        percentage:
          total === 0
            ? 0
            : Math.round(
                (present / total) * 100
              ),
        history: updatedHistory,
      },
    });
  };

  const displayedHistory = showAllHistory
    ? selectedSubject.attendance.history
    : selectedSubject.attendance.history.slice(
        0,
        5
      );

  return (
    <div className="attendance-page">
  <div className="attendance-header">
    <h1>Attendance</h1>
  </div>

  {/* Selected Subject */}

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
          {selectedSubject.attendance.present}/{totalClasses}
        </h3>

        <span>{attendancePercentage}%</span>
      </div>
    </div>

    {/* Safe Skip */}

    <div className="safe-box">
      <h4>
        ✅ You can safely skip the next {safeToSkip} classes.
      </h4>

      <p>You're maintaining a healthy attendance.</p>
    </div>

    {/* Progress */}

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

    {/* Count */}

    <div className="attendance-count">
      <span>
        {selectedSubject.attendance.present} Present
      </span>

      <span>
        {selectedSubject.attendance.absent} Absent
      </span>
    </div>

    {/* Buttons */}

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

    {/* History */}

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

                <td>{item.day}</td>

                <td
                  className={
                    item.status === "Present"
                      ? "present"
                      : "absent"
                  }
                >
                  ● {item.status}
                </td>

                <td>{item.type}</td>

                <td>
                  <button
                    className="delete-history-btn"
                    onClick={() =>
                      deleteHistory(item.id)
                    }
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

      {selectedSubject.attendance.history.length > 5 && (
        <div className="history-footer">
          <button
            className="read-more-btn"
            onClick={() =>
              setShowAllHistory(!showAllHistory)
            }
          >
            {showAllHistory
              ? "Show Less ▲"
              : "Read More ▼"}
          </button>
        </div>
      )}
    </div>
  </div>
        {/* Subject List */}

      <div className="subject-list">
        <h2>Subjects</h2>

        {subjects.map((subject) => {
          const total =
            subject.attendance.present +
            subject.attendance.absent;

          const percentage =
            total === 0
              ? 0
              : Math.round(
                  (subject.attendance.present /
                    total) *
                    100
                );

          return (
            <div
              key={subject.id}
              className={`subject-item ${
                selectedSubject.id === subject.id
                  ? "active-subject"
                  : ""
              }`}
              onClick={() => {
                setSelectedSubjectId(subject.id);
                setShowAllHistory(false);
              }}
            >
              <div>
                <h3>{subject.name}</h3>

                <p>
                  {subject.code} •{" "}
                  {subject.credits} Credits
                </p>
              </div>

              <div className="attendance-value">
                <h4>
                  {subject.attendance.present}/
                  {total}
                </h4>

                <span>{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Attendance;