import { useState, useEffect } from "react";
import "./Internals.css";
import Skeleton from "../Components/Skeleton"; 

import {
  getInternals,
  getInternalScore,
} from "../services/internalService";
import { getCourses } from "../services/courseService";
import { getProfile } from "../services/profileService";
import { getSemesters } from "../services/academicService"; 
import axiosInstance from "../services/axiosInstance";


const Internals = ({ darkMode }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSemester, setSelectedSemester] = useState(null);
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

  const loadCourses = async () => {
    try {
      const [courseRes, profileRes, semesterRes] = await Promise.all([
        getCourses(),
        getProfile(),
        getSemesters(),
      ]);

      const courses = courseRes.data.results || courseRes.data || [];
      const semesters = semesterRes.data.results || semesterRes.data || [];
      
      setSubjects(courses);

      // ⚡ GLOBAL DEFAULT SEMESTER EXTRACTION
      const currentSemData = profileRes.data.current_semester;
      const currentSemId = typeof currentSemData === "object" && currentSemData !== null ? currentSemData.id : currentSemData;
      
      const selectedSemesterObj = semesters.find((s) => String(s.id) === String(currentSemId));

      if (selectedSemesterObj) {
        // 1. Set the horizontal tab selection to their Current Semester
        const semesterNumber = selectedSemesterObj.semester_number;
        setSelectedSemester(semesterNumber);

        // 2. Select the first subject belonging to that default semester
        const semesterCourse = courses.find((course) => {
          const courseSem = course.semester_number || course.semester;
          return String(courseSem) === String(semesterNumber);
        });

        if (semesterCourse) {
          setSelectedSubjectId(semesterCourse.id);
        }
      } else if (courses.length > 0) {
        // Fallback if no current_semester is configured in Profile yet
        const fallbackSem = courses[0].semester_number || courses[0].semester;
        setSelectedSemester(fallbackSem);
        setSelectedSubjectId(courses[0].id);
      }
    } catch (err) {
      console.log("Failed to load initial data:", err);
    }
  };

  const loadInternals = async () => {
    try {
      const res = await getInternals();
      const data = res.data.results || res.data || [];
      const filtered = data.filter((item) => String(item.course) === String(selectedSubjectId));
      setEvaluations(filtered);
    } catch (err) {}
  };

  const loadScore = async () => {
    try {
      const res = await getInternalScore(selectedSubjectId);
      setWeightedScore(res.data.weighted_score || 0);
    } catch (err) {
      setWeightedScore(0);
    }
  };

  // ⚡ Extract available semester numbers safely
  const availableSemesters = [
    ...new Set(subjects.map((s) => s.semester_number || s.semester)),
  ].filter(Boolean).sort((a, b) => Number(a) - Number(b));

  const semesterSubjects = subjects.filter((subject) => {
    const subSem = subject.semester_number || subject.semester;
    return String(subSem) === String(selectedSemester);
  });

  const selectedSubject = subjects.find((sub) => String(sub.id) === String(selectedSubjectId));

  useEffect(() => {
    if (
      semesterSubjects.length > 0 &&
      !semesterSubjects.some((s) => String(s.id) === String(selectedSubjectId))
    ) {
      setSelectedSubjectId(semesterSubjects[0].id);
    }
  }, [selectedSemester, subjects, semesterSubjects, selectedSubjectId]);

  // Prevent early string output if still pulling data from your backend
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
    (sum, item) => sum + Number(item.marks_obtained || 0),
    0
  );

  const totalMax = evaluations.reduce(
    (sum, item) => sum + Number(item.total_marks || 0),
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

      {/* ⚡ YOUR EXACT SEMESTER TABS (Auto-defaults to Current Semester!) */}
      <div className="semester-tabs">
        {isLoading && availableSemesters.length === 0 ? (
          <Skeleton width="120px" height="38px" borderRadius="20px" />
        ) : (
          availableSemesters.map((sem) => (
            <button
              key={sem}
              className={String(selectedSemester) === String(sem) ? "semester-btn active" : "semester-btn"}
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
              className={`subject-tab ${String(selectedSubjectId) === String(subject.id) ? "active" : ""}`}
              onClick={() => setSelectedSubjectId(subject.id)}
            >
              {subject.course_name || subject.name}
              <span>{subject.course_code || subject.code}</span>
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
                            style={{ width: `${Math.min(100, (item.marks_obtained / item.total_marks) * 100)}%` }}
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
                    strokeDashoffset={2 * Math.PI * 70 * (1 - Math.min(100, percentage) / 100)}
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
                  <strong> {Number(weightedScore).toFixed(2)}</strong>
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