import { useState, useEffect } from "react";
import "./Internals.css";
import Skeleton from "../Components/Skeleton"; 

import {
  getInternals,
  getInternalScore,
} from "../services/internalService";
import { getCourses } from "../services/courseService";
import axiosInstance from "../services/axiosInstance";

const Internals = ({ darkMode }) => {
  // 1. Loading state tracks original course fetching too
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSemester, setSelectedSemester] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [weightedScore, setWeightedScore] = useState(0);
  const [targetScore, setTargetScore] = useState(85);
  const [newAssessmentName, setNewAssessmentName] = useState("");
  const [newAssessmentMarks, setNewAssessmentMarks] = useState("");
  const [newWeightage, setNewWeightage] = useState("");

  // Load courses initially
  useEffect(() => {
    const initCourses = async () => {
      setIsLoading(true);
      await loadCourses();
      setIsLoading(false);
    };
    initCourses();
  }, []);

  // Fetch metrics when active subject updates
  useEffect(() => {
    if (selectedSubjectId) {
      const fetchSubjectData = async () => {
        setIsLoading(true); 
        try {
          await Promise.all([loadInternals(), loadScore()]);
        } finally {
          setIsLoading(false); 
        }
      };
      fetchSubjectData();
    }
  }, [selectedSubjectId]);

  useEffect(() => {
    if (semesterSubjects.length > 0) {
      setSelectedSubjectId(semesterSubjects[0].id);
    }
  }, [selectedSemester, subjects]);

  const availableSemesters = [
    ...new Set(subjects.map((s) => s.semester)),
  ].sort((a, b) => a - b);

  const loadCourses = async () => {
    try {
      const res = await getCourses();
      const courses = res.data.results || res.data;
      setSubjects(courses);
      if (courses.length > 0) {
        setSelectedSubjectId(courses[0].id);
      }
    } catch (err) {}
  };

  const loadInternals = async () => {
    try {
      const res = await getInternals();
      const data = res.data.results || res.data;
      const filtered = data.filter((item) => item.course === selectedSubjectId);
      setEvaluations(filtered);
    } catch (err) {}
  };

  const loadScore = async () => {
    try {
      const res = await getInternalScore(selectedSubjectId);
      setWeightedScore(res.data.weighted_score);
    } catch (err) {}
  };

  const semesterSubjects = subjects.filter(
    (subject) => subject.semester === selectedSemester
  );

  const selectedSubject = subjects.find((sub) => sub.id === selectedSubjectId);

  // ⚡ FIXED: Prevent early string output if still pulling data from your backend
  if (!isLoading && subjects.length === 0) {
    return (
      <div className={`internals-page ${darkMode ? "forced-dark" : ""}`}>
        <h2>No Subjects Added</h2>
      </div>
    );
  }

  // Fallback trap to keep skeletons visible until the active subject loads
  if (!selectedSubject && !isLoading) return null;

  const totalObtained = evaluations.reduce(
    (sum, item) => sum + Number(item.marks_obtained),
    0
  );

  const totalMax = evaluations.reduce(
    (sum, item) => sum + Number(item.total_marks),
    0
  );

  const percentage =
    totalMax === 0 ? 0 : Math.round((totalObtained / totalMax) * 100);

  const remaining = totalMax - totalObtained;

  const handleMarksChange = async (evaluation, field, value) => {
    let updatedValue = Number(value);
    if (field === "marks_obtained") {
      updatedValue = Math.max(0, Math.min(updatedValue, evaluation.total_marks));
    }
    if (field === "total_marks") {
      updatedValue = Math.max(1, updatedValue);
    }

    try {
      await axiosInstance.put(`internals/${evaluation.id}/`, {
        ...evaluation,
        [field]: updatedValue,
      });
      loadInternals();
      loadScore();
    } catch (err) {}
  };

  const addAssessment = async () => {
    if (!newAssessmentName.trim()) {
      alert("Enter assessment name.");
      return;
    }

    try {
      await axiosInstance.post("internals/", {
        course: selectedSubjectId,
        assessment_name: newAssessmentName,
        marks_obtained: 0,
        total_marks: Number(newAssessmentMarks) || 10,
        weightage: Number(newWeightage) || 10,
      });

      setNewAssessmentName("");
      setNewAssessmentMarks("");
      setNewWeightage("");

      loadInternals();
      loadScore();
    } catch (err) {}
  };

  const deleteAssessment = async (id) => {
    if (!window.confirm("Delete this assessment?")) return;
    try {
      await axiosInstance.delete(`internals/${id}/`);
      loadInternals();
      loadScore();
    } catch (err) {}
  };

  return (
    <div className={`internals-page ${darkMode ? "forced-dark" : ""}`}>
      <div className="internals-header">
        <h1>Internals</h1>
      </div>

      <div className="semester-tabs">
        {isLoading && availableSemesters.length === 0 ? (
          <Skeleton width="120px" height="38px" borderRadius="20px" />
        ) : (
          availableSemesters.map((sem) => (
            <button
              key={sem}
              className={selectedSemester === sem ? "semester-btn active" : "semester-btn"}
              onClick={() => setSelectedSemester(sem)}
            >
              Semester {sem}
            </button>
          ))
        )}
      </div>

      <div className="subject-tabs">
        {isLoading && semesterSubjects.length === 0 ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Skeleton width="140px" height="42px" borderRadius="8px" />
            <Skeleton width="140px" height="42px" borderRadius="8px" />
          </div>
        ) : (
          semesterSubjects.map((subject) => (
            <button
              key={subject.id}
              className={`subject-tab ${selectedSubjectId === subject.id ? "active" : ""}`}
              onClick={() => setSelectedSubjectId(subject.id)}
            >
              {subject.course_name}
              <span>{subject.course_code}</span>
            </button>
          ))
        )}
      </div>

      <div className="internals-content">
        
        {/* ================= LEFT COLUMN: ASSESSMENTS ================= */}
        <div className="assessment-card">
          <h2>Assessments</h2>

          {isLoading ? (
            <>
              {/* Refined text-level inline mock elements */}
              <div style={{ padding: '12px 0' }}><Skeleton width="100%" height="24px" /></div>
              <div style={{ padding: '12px 0' }}><Skeleton width="100%" height="32px" /></div>
              <div style={{ padding: '12px 0' }}><Skeleton width="100%" height="32px" /></div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                 <Skeleton width="30%" height="38px" borderRadius="6px" />
                 <Skeleton width="20%" height="38px" borderRadius="6px" />
                 <Skeleton width="20%" height="38px" borderRadius="6px" />
                 <Skeleton width="30%" height="38px" borderRadius="6px" />
              </div>
            </>
          ) : (
            <>
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
                  {evaluations.map((item) => (
                    <tr key={item.id}>
                      <td>{item.assessment_name}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.total_marks}
                          onChange={(e) => handleMarksChange(item, "total_marks", e.target.value)}
                        />
                      </td>
                      <td>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${(item.marks_obtained / item.total_marks) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max={item.total_marks}
                          value={item.marks_obtained}
                          onChange={(e) => {
                            let value = Number(e.target.value);
                            if (value > item.total_marks) value = item.total_marks;
                            if (value < 0) value = 0;
                            handleMarksChange(item, "marks_obtained", value);
                          }}
                        />
                      </td>
                      <td>
                        <button className="delete-assessment-btn" onClick={() => deleteAssessment(item.id)}>
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
                  onChange={(e) => setNewAssessmentName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max Marks"
                  value={newAssessmentMarks}
                  onChange={(e) => setNewAssessmentMarks(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Weightage (%)"
                  value={newWeightage}
                  onChange={(e) => setNewWeightage(e.target.value)}
                />
                <button onClick={addAssessment}>+ Add Assessment</button>
              </div>
            </>
          )}
        </div>

        {/* ================= RIGHT COLUMN: PROGRESS & PREDICTION ================= */}
        <div className="progress-card">
          <h3>Overall Progress</h3>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton width="170px" height="170px" variant="circular" />
              <br /><br />
              <Skeleton width="80%" height="20px" />
              <br />
              <Skeleton width="50%" height="16px" />
              <br /><br />
              <Skeleton width="100%" height="54px" borderRadius="6px" />
              <br />
              <Skeleton width="100%" height="110px" borderRadius="10px" />
            </div>
          ) : (
            <>
              <div className="circle-progress">
                <svg width="170" height="170">
                  <circle
                    cx="85"
                    cy="85"
                    r="70"
                    stroke={darkMode ? "#334155" : "#e5e7eb"}
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="85"
                    cy="85"
                    r="70"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 70}
                    strokeDashoffset={2 * Math.PI * 70 * (1 - percentage / 100)}
                    transform="rotate(-90 85 85)"
                  />
                  <text
                    x="85"
                    y="80"
                    textAnchor="middle"
                    fontSize="28"
                    fontWeight="700"
                    fill={darkMode ? "#f8fafc" : "#1f2937"}
                  >
                    {percentage}%
                  </text>
                  <text
                    x="85"
                    y="105"
                    textAnchor="middle"
                    fontSize="14"
                    fill={darkMode ? "#94a3b8" : "#6b7280"}
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
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                />
              </div>

              <div className="success-box">
                <h4>Prediction</h4>
                <p>
                  Current Weighted Score:
                  <strong> {weightedScore}</strong>
                  <br /><br />
                  Need approximately
                  <strong>
                    {" "}
                    {Math.max(0, targetScore - weightedScore).toFixed(2)}
                  </strong>
                  {" "}more weighted marks to reach
                  <strong> {targetScore}</strong>.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="note-box">
        <strong>Note:</strong> Changes are saved automatically to your account.
      </div>
    </div>
  );
};

export default Internals;