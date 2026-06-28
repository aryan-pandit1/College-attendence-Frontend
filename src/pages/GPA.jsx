import { useState, useMemo } from "react";
import { useSubjects } from "../context/SubjectContext";
import "./GPA.css";

const gradeScale = {
  AA: 10,
  AB: 9,
  BB: 8,
  BC: 7,
  CC: 6,
  CD: 5,
  DD: 4,
  F: 0,
};

const GPA = () => {
 const { subjects, editSubject } = useSubjects();

const [selectedSemester, setSelectedSemester] = useState(1);

const semesterSubjects = subjects.filter(
  (subject) =>
    Number(subject.semester) === selectedSemester
);

  // ---------------------------
  // Target Calculator
  // ---------------------------

  const [currentCGPA, setCurrentCGPA] = useState(8.2);

  const [completedSemesters, setCompletedSemesters] =
    useState(5);

  const [remainingSemesters, setRemainingSemesters] =
    useState(3);

  const [targetCGPA, setTargetCGPA] =
    useState(9);

  // ---------------------------
  // CGPA Trend
  // ---------------------------

  const cgpaTrend = [
    6.45,
    7.12,
    7.48,
    7.89,
    8.24,
  ];

  const grades = Object.entries(gradeScale);

  // ---------------------------
  // Update Grade
  // ---------------------------

  const handleGradeChange = (id, grade) => {
    editSubject(id, {
      grades: {
        grade,
        gradePoint: gradeScale[grade],
      },
    });
  };

  // ---------------------------
  // Calculations
  // ---------------------------

  const totalCredits = subjects.reduce(
    (sum, subject) => sum + subject.credits,
    0
  );

  const estimatedSGPA = useMemo(() => {
    if (totalCredits === 0) return "0.00";

    const totalPoints = subjects.reduce(
      (sum, subject) =>
        sum +
        subject.credits *
          (subject.grades?.gradePoint || 0),
      0
    );

    return (
      totalPoints / totalCredits
    ).toFixed(2);
  }, [subjects, totalCredits]);

const estimatedCGPA = Math.min(
  10,
  (
    (currentCGPA * completedSemesters +
      Number(estimatedSGPA)) /
    (completedSemesters + 1)
  )
).toFixed(2);

const calculatedRequiredSGPA =
  remainingSemesters === 0
    ? 0
    : (
        targetCGPA *
          (completedSemesters + remainingSemesters) -
        currentCGPA * completedSemesters
      ) / remainingSemesters;

const requiredSGPA =
  calculatedRequiredSGPA > 10
    ? "Impossible"
    : Math.max(0, calculatedRequiredSGPA).toFixed(2);
  return (
    <div className="gpa-page">
      <div className="gpa-header">
  <h1>GPA Calculator</h1>

  <div className="semester-select">
    <label>Semester</label>

    <select
      value={selectedSemester}
      onChange={(e) =>
        setSelectedSemester(Number(e.target.value))
      }
    >
      {[1,2,3,4,5,6,7,8].map((sem) => (
        <option key={sem} value={sem}>
          Semester {sem}
        </option>
      ))}
    </select>
  </div>
</div>

      <div className="gpa-top">

        {/* CGPA Trend */}

        <div className="card trend-card">
          <h3>CGPA Trend</h3>

          <div className="chart">
            {cgpaTrend.map((cgpa, index) => (
              <div
                className="bar-item"
                key={index}
              >
                <span>{cgpa}</span>

                <div
                  className="bar"
                  style={{
                    height: `${cgpa * 22}px`,
                  }}
                />

                <p>Sem {index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Target Calculator */}

        <div className="card target-card">
          <h3>🎯 Target CGPA Calculator</h3>

          <div className="target-row">
            <span>Current CGPA</span>

            <input
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={currentCGPA}
              onChange={(e) =>
                setCurrentCGPA(
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="target-row">
            <span>Completed Semesters</span>

            <input
              type="number"
              min="1"
              value={completedSemesters}
              onChange={(e) =>
                setCompletedSemesters(
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="target-row">
            <span>Remaining Semesters</span>

            <input
              type="number"
              min="1"
              value={remainingSemesters}
              onChange={(e) =>
                setRemainingSemesters(
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="target-row">
            <span>Target CGPA</span>

            <input
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={targetCGPA}
              onChange={(e) =>
                setTargetCGPA(
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="target-result">
            <p>Required Average SGPA</p>

            <h2>{requiredSGPA}</h2>
          </div>
          <hr />



          {requiredSGPA > 10 ? (
            <p className="warning">
              ⚠️ Target CGPA cannot be achieved.
            </p>
          ) : requiredSGPA >= 9 ? (
            <p className="warning">
              🔥 You need excellent performance.
            </p>
          ) : requiredSGPA >= 8 ? (
            <p className="good">
              👍 Strong performance is required.
            </p>
          ) : (
            <p className="good">
              ✅ Target is achievable.
            </p>
          )}
        </div>
      </div>

      <div className="gpa-middle">
                {/* Current Semester Subjects */}

        <div className="card subjects-card">
          <div className="subjects-header">
  <h3>Current Semester Subjects</h3>

  <div className="semester-filter">
    <label>Semester</label>

    <select
      value={selectedSemester}
      onChange={(e) =>
        setSelectedSemester(Number(e.target.value))
      }
    >
      {[1,2,3,4,5,6,7,8].map((sem) => (
        <option key={sem} value={sem}>
          Semester {sem}
        </option>
      ))}
    </select>
  </div>
</div>

          {semesterSubjects.length === 0 ? (
  <div className="empty-subjects">
    <h3>No Subjects Found</h3>
    <p>
      Add subjects for Semester {selectedSemester}
      from the Profile → Add Subject menu.
    </p>
  </div>
) : (
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Credits</th>
                  <th>Grade</th>
                  <th>Grade Point</th>
                </tr>
              </thead>

              <tbody>
                {semesterSubjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.name}</td>

                    <td>{subject.credits}</td>

                    <td>
                      <select
                        value={subject.grades?.grade || ""}
                        onChange={(e) =>
                          handleGradeChange(
                            subject.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Select
                        </option>

                        {Object.keys(gradeScale).map(
                          (grade) => (
                            <option
                              key={grade}
                              value={grade}
                            >
                              {grade}
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    <td>
                      {subject.grades?.gradePoint || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Grade Scale */}

        <div className="card grade-card">
          <h3>Grade Scale</h3>

          <table>
            <thead>
              <tr>
                <th>Grade</th>
                <th>Point</th>
              </tr>
            </thead>

            <tbody>
              {grades.map(([grade, point]) => (
                <tr key={grade}>
                  <td>{grade}</td>
                  <td>{point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

            {/* Summary */}

      <div className="summary-card">

        <div className="summary-item">
          <span>Estimated SGPA</span>

          <h2>{estimatedSGPA}</h2>
        </div>

        <div className="summary-item">
          <span>Total Credits</span>

          <h2>{totalCredits}</h2>
        </div>

        <div className="summary-item">
          <span>Estimated CGPA</span>

          <h2>{estimatedCGPA}</h2>
        </div>

      </div>

    </div>
  );
};

export default GPA;