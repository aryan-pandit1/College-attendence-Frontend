import { useState, useEffect } from "react";
import "./Dashboard.css";
import { useSubjects } from "../context/SubjectContext";

const Dashboard = () => {
  const { subjects } = useSubjects();

  const studentData = {
    name: localStorage.getItem("userName") || "Student",
  };

  // ===========================
  // Overall Attendance
  // ===========================

  const totalPresent = subjects.reduce(
    (sum, subject) => sum + subject.attendance.present,
    0
  );

  const totalAbsent = subjects.reduce(
    (sum, subject) => sum + subject.attendance.absent,
    0
  );

  const totalClasses = totalPresent + totalAbsent;

  const attendancePercentage =
    totalClasses === 0
      ? 0
      : Math.round((totalPresent / totalClasses) * 100);

  // ===========================
  // Credits
  // ===========================

  const totalCredits = subjects.reduce(
    (sum, subject) => sum + Number(subject.credits),
    0
  );

  // ===========================
  // Internals Average
  // ===========================

  const averageInternals =
    subjects.length === 0
      ? 0
      : Math.round(
          subjects.reduce(
            (sum, subject) =>
              sum + subject.internals.obtainedMarks,
            0
          ) / subjects.length
        );

  // ===========================
  // CGPA
  // ===========================

  const cgpa =
    subjects.length === 0
      ? 0
      : (
          subjects.reduce(
            (sum, subject) =>
              sum + subject.grades.gradePoint,
            0
          ) / subjects.length
        ).toFixed(2);

  // ===========================
  // Safe To Skip
  // ===========================

  const safeToSkip = Math.max(
    0,
    Math.floor(
      (totalPresent -
        0.75 * totalClasses) /
        0.75
    )
  );

  // ===========================
  // Today's Schedule
  // ===========================

  const [schedule, setSchedule] = useState(() => {
    const saved =
      localStorage.getItem("schedule");

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            time: "09:00 AM",
            subject: "Data Structures",
            room: "Room 301",
            marked: false,
          },
          {
            id: 2,
            time: "11:00 AM",
            subject: "Discrete Mathematics",
            room: "Room 202",
            marked: false,
          },
          {
            id: 3,
            time: "01:00 PM",
            subject: "Digital Electronics",
            room: "Lab 1",
            marked: false,
          },
          {
            id: 4,
            time: "03:00 PM",
            subject: "Operating Systems",
            room: "Room 303",
            marked: false,
          },
        ];
  });

  const [deadlines] = useState([
    {
      title: "DBMS Assignment",
      date: "May 18",
    },
    {
      title: "CN Lab Record",
      date: "May 20",
    },
    {
      title: "OS Quiz",
      date: "May 21",
    },
  ]);

  useEffect(() => {
    localStorage.setItem(
      "schedule",
      JSON.stringify(schedule)
    );
  }, [schedule]);

  const markAttendance = (id, status) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              marked: true,
              status,
            }
          : item
      )
    );
  };

  const resetDashboard = () => {
    localStorage.removeItem("subjects");
    localStorage.removeItem("schedule");
    window.location.reload();
  };

    return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back, {studentData.name} 👋
          </p>
        </div>

        <button
          className="reset-btn"
          onClick={resetDashboard}
        >
          Reset Data
        </button>
      </header>

      {/* Stats Cards */}

      <div className="stats-grid">
        <div className="card attendance-card">
          <h3>Overall Attendance</h3>

          <div className="circle">
            <span>{attendancePercentage}%</span>
          </div>

          <p>
            {attendancePercentage >= 75
              ? "Good Standing"
              : "Attendance Low"}
          </p>
        </div>

        <div className="card">
          <h3>CGPA</h3>

          <h2>{cgpa}</h2>

          <span>/10</span>
        </div>

        <div className="card">
          <h3>Average Internals</h3>

          <h2>{averageInternals}</h2>

          <span>/100</span>
        </div>

        <div className="card">
          <h3>Total Credits</h3>

          <h2>{totalCredits}</h2>

          <span>Credits</span>
        </div>
      </div>

      {/* Attendance Alert */}

      <div className="alert-box">
        {attendancePercentage >= 75 ? (
          <>
            ✅ You can safely skip the next{" "}
            <strong>{safeToSkip}</strong> classes.
          </>
        ) : (
          <>
            ⚠️ Your attendance is below 75%.
            Attend upcoming classes.
          </>
        )}
      </div>

      <div className="dashboard-content">
        {/* Today's Schedule */}

        <div className="schedule-section">
          <h2>Today's Schedule</h2>

          {schedule.map((item) => (
            <div
              key={item.id}
              className="schedule-card"
            >
              <div>
                <h4>{item.subject}</h4>

                <p>{item.time}</p>

                <small>{item.room}</small>
              </div>

              <div className="attendance-buttons">
                {item.marked ? (
                  <span
                    className={
                      item.status === "present"
                        ? "marked-present"
                        : "marked-absent"
                    }
                  >
                    {item.status === "present"
                      ? "Present"
                      : "Absent"}
                  </span>
                ) : (
                  <>
                    <button
                      className="present-btn"
                      onClick={() =>
                        markAttendance(
                          item.id,
                          "present"
                        )
                      }
                    >
                      Present
                    </button>

                    <button
                      className="absent-btn"
                      onClick={() =>
                        markAttendance(
                          item.id,
                          "absent"
                        )
                      }
                    >
                      Absent
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

                {/* Right Panel */}

        <div className="right-panel">
          {/* Attendance Overview */}

          <div className="card">
            <h3>Attendance Overview</h3>

            <div className="overview-circle">
              <div className="inner-circle">
                {attendancePercentage}%
              </div>
            </div>

            <ul>
              <li>
                Present: {totalPresent}
              </li>

              <li>
                Absent: {totalAbsent}
              </li>

              <li>
                Total Classes: {totalClasses}
              </li>

              <li>
                Subjects: {subjects.length}
              </li>
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

            {subjects.length === 0 ? (
              <p>No subjects added.</p>
            ) : (
              <div className="subject-overview">
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
                      className="subject-summary"
                    >
                      <div>
                        <h4>{subject.name}</h4>

                        <small>
                          {subject.code}
                        </small>
                      </div>

                      <span>
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