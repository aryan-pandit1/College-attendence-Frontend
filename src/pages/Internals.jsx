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
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [targetScore, setTargetScore] = useState(85);
  const [newAssessmentName, setNewAssessmentName] = useState("");
const [newAssessmentMarks, setNewAssessmentMarks] = useState("");
const availableSemesters = useMemo(() => {
  return [
    ...new Set(
      subjects.map((sub) => Number(sub.semester))
    ),
  ].sort((a, b) => a - b);
}, [subjects]);

 const semesterSubjects = useMemo(() => {
  return subjects.filter(
    (sub) =>
      Number(sub.semester) === Number(selectedSemester)
  );
}, [subjects, selectedSemester]);

useEffect(() => {
  if (availableSemesters.length === 0) return;

  // Select first available semester
  if (
    selectedSemester === null ||
    !availableSemesters.includes(selectedSemester)
  ) {
    setSelectedSemester(availableSemesters[0]);
    return;
  }

  // Select first subject of that semester
  if (semesterSubjects.length > 0) {
    if (
      !selectedSubject ||
      selectedSubject.semester !== selectedSemester
    ) {
      setSelectedSubject(semesterSubjects[0]);
    }
  } else {
    setSelectedSubject(null);
  }
}, [
  availableSemesters,
  semesterSubjects,
  selectedSemester,
  selectedSubject,
]);

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

  let newValue = Number(value);

  if (field === "obtained") {
    newValue = Math.min(
      Math.max(newValue, 0),
      updatedAssessments[index].maxMarks
    );
  }

  if (field === "maxMarks") {
    newValue = Math.max(newValue, 1);

    if (
      updatedAssessments[index].obtained >
      newValue
    ) {
      updatedAssessments[index].obtained =
        newValue;
    }
  }

  updatedAssessments[index] = {
    ...updatedAssessments[index],
    [field]: newValue,
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

  const addAssessment = () => {
  if (!newAssessmentName.trim()) {
    alert("Enter assessment name.");
    return;
  }

  const updatedAssessments = [
    ...assessments,
    {
      name: newAssessmentName,
      maxMarks: Number(newAssessmentMarks) || 10,
      obtained: 0,
    },
  ];

  editSubject(selectedSubject.id, {
    internals: {
      ...selectedSubject.internals,
      assessments: updatedAssessments,
    },
  });

  setSelectedSubject({
    ...selectedSubject,
    internals: {
      ...selectedSubject.internals,
      assessments: updatedAssessments,
    },
  });

  setNewAssessmentName("");
  setNewAssessmentMarks("");
};

const deleteAssessment = (index) => {
  if (!window.confirm("Delete this assessment?"))
    return;

  const updatedAssessments = assessments.filter(
    (_, i) => i !== index
  );

  editSubject(selectedSubject.id, {
    internals: {
      ...selectedSubject.internals,
      assessments: updatedAssessments,
    },
  });

  setSelectedSubject({
    ...selectedSubject,
    internals: {
      ...selectedSubject.internals,
      assessments: updatedAssessments,
    },
  });
};

  if (subjects.length === 0) {
    return (
      <div className="internals-page">
        <h2>No Subjects Added</h2>
        <p>Add subjects from Profile → Add Subject.</p>
      </div>
    );
  }

  if (!selectedSubject) {
  return (
    <div className="internals-page">
      <h2>No Subjects</h2>
      <p>
        No subjects available in Semester {selectedSemester}.
      </p>
    </div>
  );
}

  return (
    <div className="internals-page">
      <div className="internals-header">
        <h1>Internals</h1>
      </div>

    <div className="semester-tabs">
  {availableSemesters.map((sem) => (
    <button
      key={sem}
      className={
        selectedSemester === sem
          ? "semester-btn active"
          : "semester-btn"
      }
      onClick={() => setSelectedSemester(sem)}
    >
      Semester {sem}
    </button>
  ))}
</div>

      <div className="subject-tabs">
        {semesterSubjects.map((subject) => (
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
<th>Action</th>
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
  onChange={(e) => {
    let value = Number(e.target.value);

    if (value > item.maxMarks) {
      value = item.maxMarks;
    }

    if (value < 0) {
      value = 0;
    }

    handleMarksChange(
      index,
      "obtained",
      value
    );
  }}
/>
                  </td>
                  <td>
  <button
    className="delete-assessment-btn"
    onClick={() => deleteAssessment(index)}
  >
    Delete
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="add-assessment">

  <input
    type="text"
    placeholder="Assessment Name"
    value={newAssessmentName}
    onChange={(e) =>
      setNewAssessmentName(e.target.value)
    }
  />

  <input
    type="number"
    placeholder="Max Marks"
    value={newAssessmentMarks}
    onChange={(e) =>
      setNewAssessmentMarks(e.target.value)
    }
  />

  <button onClick={addAssessment}>
    + Add Assessment
  </button>

</div>

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