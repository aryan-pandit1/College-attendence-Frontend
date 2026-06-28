import { useState, useEffect, useMemo } from "react";
import { useSubjects } from "../context/SubjectContext";
import "./Internals.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const defaultAssessments = [
  { name: "Mid-Sem Exam", maxMarks: 30, obtained: 0 },
  { name: "Quiz 1", maxMarks: 10, obtained: 0 },
  { name: "Quiz 2", maxMarks: 10, obtained: 0 },
  { name: "Lab 1", maxMarks: 10, obtained: 0 },
  { name: "Lab 2", maxMarks: 10, obtained: 0 },
  { name: "Assignment", maxMarks: 10, obtained: 0 },
  { name: "Attendance", maxMarks: 10, obtained: 0 },
];

const Internals = () => {
  const { subjects, editSubject } = useSubjects();

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [targetScore, setTargetScore] = useState(85);

  useEffect(() => {
    if (subjects.length > 0) {
      if (
        !selectedSubject ||
        !subjects.find((s) => s.id === selectedSubject.id)
      ) {
        setSelectedSubject(subjects[0]);
      }
    } else {
      setSelectedSubject(null);
    }
  }, [subjects]);

  const assessments = useMemo(() => {
    if (!selectedSubject) return defaultAssessments;

    return (
      selectedSubject.internals?.assessments ||
      defaultAssessments
    );
  }, [selectedSubject]);

  const totalObtained = useMemo(() => {
    return assessments.reduce(
      (sum, item) => sum + Number(item.obtained),
      0
    );
  }, [assessments]);

  const totalMax = useMemo(() => {
    return assessments.reduce(
      (sum, item) => sum + Number(item.maxMarks),
      0
    );
  }, [assessments]);

  const percentage =
    totalMax === 0
      ? 0
      : Math.round((totalObtained / totalMax) * 100);

  const remaining = totalMax - totalObtained;

  const marksNeeded = Math.max(
    0,
    targetScore - totalObtained
  );

  const handleMarksChange = (index, field, value) => {
    const updatedAssessments = [...assessments];

    updatedAssessments[index] = {
      ...updatedAssessments[index],
      [field]: Number(value),
    };

    const updatedSubject = {
      ...selectedSubject,
      internals: {
        ...selectedSubject.internals,
        assessments: updatedAssessments,
      },
    };

    editSubject(selectedSubject.id, {
      internals: updatedSubject.internals,
    });

    setSelectedSubject(updatedSubject);
  };

  if (subjects.length === 0) {
    return (
      <div className="internals-page">
        <h2>No Subjects Added</h2>
        <p>Add subjects from Profile → Add Subject.</p>
      </div>
    );
  }

  if (!selectedSubject) return null;

  return (
    <div className="internals-page">
      <div className="internals-header">
        <h1>Internals</h1>
      </div>

      <div className="subject-tabs">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            className={`subject-tab ${
              selectedSubject.id === subject.id
                ? "active"
                : ""
            }`}
            onClick={() => setSelectedSubject(subject)}
          >
            {subject.name}
            <span>{subject.code}</span>
          </button>
        ))}
      </div>

      <div className="internals-content">

        <div className="assessment-card">
          <h2>Assessments</h2>

          <table>
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Max Marks</th>
                <th>Progress</th>
                <th>Obtained</th>
              </tr>
            </thead>

            <tbody>
              {assessments.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>

                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.maxMarks}
                      onChange={(e) =>
                        handleMarksChange(
                          index,
                          "maxMarks",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            (item.obtained /
                              item.maxMarks) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      max={item.maxMarks}
                      value={item.obtained}
                      onChange={(e) =>
                        handleMarksChange(
                          index,
                          "obtained",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="progress-card">
          <h3>Overall Progress</h3>

          <div className="circle-progress">
  <svg width="170" height="170">

    {/* Background Circle */}
    <circle
      cx="85"
      cy="85"
      r="70"
      stroke="#e5e7eb"
      strokeWidth="12"
      fill="none"
    />

    {/* Progress Circle */}
    <circle
      cx="85"
      cy="85"
      r="70"
      stroke="#3b82f6"
      strokeWidth="12"
      fill="none"
      strokeLinecap="round"
      strokeDasharray={2 * Math.PI * 70}
      strokeDashoffset={
        2 * Math.PI * 70 *
        (1 - percentage / 100)
      }
      transform="rotate(-90 85 85)"
    />

    <text
      x="85"
      y="80"
      textAnchor="middle"
      fontSize="28"
      fontWeight="700"
      fill="#1f2937"
    >
      {percentage}%
    </text>

    <text
      x="85"
      y="105"
      textAnchor="middle"
      fontSize="14"
      fill="#6b7280"
    >
      {totalObtained}/{totalMax}
    </text>

  </svg>
</div>

          <div className="stats">
            <div>
              <span className="dot green"></span>
              Secured
              <strong>{totalObtained}</strong>
            </div>

            <div>
              <span className="dot gray"></span>
              Remaining
              <strong>{remaining}</strong>
            </div>
          </div>

          <div className="target-box">
            <label>Target Internal Marks</label>

            <input
              type="number"
              value={targetScore}
              onChange={(e) =>
                setTargetScore(Number(e.target.value))
              }
            />
          </div>

          <div className="success-box">
            <h4>Prediction</h4>

            <p>
              Need <strong>{marksNeeded}</strong> more marks
              to reach <strong>{targetScore}</strong>.
            </p>
          </div>
        </div>

      </div>

      <div className="note-box">
        <strong>Note:</strong> Changes are saved automatically in LocalStorage.
      </div>
    </div>
  );
};

export default Internals;