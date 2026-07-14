import { useState, useEffect, useContext } from "react";
import { StudentContext } from "../context/StudentContext"; 
import "./GPA.css";
import Skeleton from "../Components/Skeleton"; 

import { getCourses } from "../services/courseService";
import {
  getSemesters,
  getGrades,
  addGrade,
  updateGrade,
  getSGPA,
  getCGPA,
} from "../services/academicService";

const gradeScale = {
  AA: 10, AB: 9, BB: 8, BC: 7, CC: 6, CD: 5, DD: 4, F: 0,
};

const GPA = ({ darkMode }) => {
  const { currentSemesterId } = useContext(StudentContext) || {};

  const [isLoading, setIsLoading] = useState(true);
  const [isSemesterLoading, setIsSemesterLoading] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [sgpa, setSGPA] = useState(0);
  const [cgpa, setCGPA] = useState(0);
  const [graphData, setGraphData] = useState([]);

  // Target Calculator States
  const [currentCGPA, setCurrentCGPA] = useState(0);
  const [completedSemesters, setCompletedSemesters] = useState(1);
  const [remainingSemesters, setRemainingSemesters] = useState(7);
  const [targetCGPA, setTargetCGPA] = useState(9);

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      await Promise.all([loadCourses(), loadSemesters(), loadCGPA()]);
      setIsLoading(false);
    };
    initData();
  }, []);

  // Sync Global Default Semester
  useEffect(() => {
    if (currentSemesterId && semesters.length > 0 && !selectedSemester) {
      const found = semesters.find((s) => String(s.id) === String(currentSemesterId));
      setSelectedSemester(found ? found.id : semesters[0].id);
    }
  }, [currentSemesterId, semesters]);

  // Update Calculator and Grades when semester changes
  useEffect(() => {
    if (selectedSemester && semesters.length > 0) {
      const semObj = semesters.find(s => s.id === selectedSemester);
      const semNum = semObj ? semObj.semester_number : 1;
      setCompletedSemesters(Math.max(0, semNum - 1));
      setRemainingSemesters(Math.max(0, 8 - semNum));
      
      const fetchSemesterData = async () => {
        setIsSemesterLoading(true);
        await Promise.all([loadGrades(), loadSGPA()]);
        setIsSemesterLoading(false);
      };
      fetchSemesterData();
    }
  }, [selectedSemester, semesters]);

  useEffect(() => {
    if (semesters.length > 0) loadGraph(semesters);
  }, [semesters]);

  const loadCourses = async () => {
    try {
      const res = await getCourses();
      setSubjects(res.data.results || res.data || []);
    } catch (err) {}
  };

  const loadSemesters = async () => {
    try {
      const res = await getSemesters();
      const data = (res.data.results || res.data || []).sort((a,b) => a.semester_number - b.semester_number);
      setSemesters(data);
      if (data.length > 0) {
        const defaultSem = currentSemesterId
          ? data.find((s) => String(s.id) === String(currentSemesterId))?.id || data[0].id
          : data[0].id;
        setSelectedSemester(defaultSem);
      }
    } catch (err) {}
  };

  const loadGrades = async () => {
    try {
      const res = await getGrades();
      setGrades(res.data.results || res.data || []);
    } catch (err) {}
  };

  const loadSGPA = async () => {
    try {
      const res = await getSGPA(selectedSemester);
      setSGPA(res.data.sgpa || 0);
    } catch (err) { setSGPA(0); }
  };

  const loadCGPA = async () => {
    try {
      const res = await getCGPA();
      setCGPA(res.data.cgpa || 0);
      setCurrentCGPA(res.data.cgpa || 0);
    } catch (err) { setCGPA(0); }
  };

  const loadGraph = async (targetSemesters) => {
    const graph = [];
    for (const semester of targetSemesters) {
      try {
        const res = await getSGPA(semester.id);
        graph.push({ semester: `Sem ${semester.semester_number}`, sgpa: Number(res.data.sgpa || 0) });
      } catch { graph.push({ semester: `Sem ${semester.semester_number}`, sgpa: 0 }); }
    }
    setGraphData(graph);
  };

  const semesterSubjects = subjects.filter((subject) => {
    const semester = semesters.find((sem) => String(sem.id) === String(selectedSemester));
    if (!semester) return false;
    const semVal = subject.semester_id || subject.semester?.id || subject.semester || subject.semester_number;
    return String(semVal) === String(selectedSemester) || String(semVal) === String(semester.semester_number);
  });

  const handleGradeChange = async (courseId, gradePoint) => {
    if (gradePoint === "") return;
    try {
      const existingGrade = grades.find(g => String(g.course) === String(courseId) && String(g.semester) === String(selectedSemester));
      if (existingGrade) {
        await updateGrade(existingGrade.id, { semester: selectedSemester, course: courseId, grade_point: Number(gradePoint) });
      } else {
        await addGrade({ semester: selectedSemester, course: courseId, grade_point: Number(gradePoint) });
      }
      loadGrades(); loadSGPA(); loadCGPA(); loadGraph(semesters);
    } catch (err) {}
  };

  const getGradePoint = (courseId) => {
    const record = grades.find(g => String(g.course) === String(courseId) && String(g.semester) === String(selectedSemester));
    return record ? record.grade_point : "";
  };

  const totalCredits = semesterSubjects.reduce((sum, s) => sum + s.credits, 0);
  const estimatedSGPA = Number(sgpa).toFixed(2);
  const estimatedCGPA = Number(cgpa).toFixed(2);
  const requiredSGPA = Math.max(0, (targetCGPA * (completedSemesters + remainingSemesters) - currentCGPA * completedSemesters) / remainingSemesters || 0).toFixed(2);
  const gradeOptions = Object.entries(gradeScale);

  return (
    <div className={`gpa-page ${darkMode ? "forced-dark" : ""}`}>
      <div className="gpa-header">
        <h1>GPA Calculator</h1>
        <div className="semester-select">
          <label>Semester</label>
          {isLoading ? <Skeleton width="150px" height="38px" borderRadius="8px" /> : (
            <select value={selectedSemester || ""} onChange={(e) => setSelectedSemester(Number(e.target.value))}>
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  Semester {sem.semester_number} {String(sem.id) === String(currentSemesterId) ? "★" : ""}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="gpa-top">
        <div className="card trend-card">
          <h3>SGPA Trend</h3>
          <div className="chart">
            {isLoading ? <Skeleton width="100%" height="150px" /> : graphData.map(item => (
              <div key={item.semester} className="bar-item">
                <span>{item.sgpa.toFixed(2)}</span>
                <div className="bar" style={{ height: `${item.sgpa * 22}px` }} />
                <p>{item.semester}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card target-card">
          <h3>🎯 Target CGPA Calculator</h3>
          <div className="target-row"><span>Current CGPA</span><input type="number" value={currentCGPA} onChange={(e) => setCurrentCGPA(Number(e.target.value))} /></div>
          <div className="target-row"><span>Completed Semesters</span><input type="number" value={completedSemesters} onChange={(e) => setCompletedSemesters(Number(e.target.value))} /></div>
          <div className="target-row"><span>Remaining Semesters</span><input type="number" value={remainingSemesters} onChange={(e) => setRemainingSemesters(Number(e.target.value))} /></div>
          <div className="target-row"><span>Target CGPA</span><input type="number" value={targetCGPA} onChange={(e) => setTargetCGPA(Number(e.target.value))} /></div>
          <div className="target-result"><p>Required Average SGPA</p><h2>{requiredSGPA > 10 ? "Impossible" : requiredSGPA}</h2></div>
        </div>
      </div>

      <div className="gpa-middle">
        <div className="card subjects-card">
          <h3>Semester Subjects</h3>
          <table>
            <thead><tr><th>Subject</th><th>Credits</th><th>Grade Point</th><th>Points</th></tr></thead>
            <tbody>
              {isLoading || isSemesterLoading ? [1,2,3,4].map(i => <tr key={i}><td colSpan="4"><Skeleton width="100%" height="20px" /></td></tr>) : 
                semesterSubjects.map(s => {
                  const gp = getGradePoint(s.id);
                  return (
                    <tr key={s.id}>
                      <td>{s.course_name}</td><td>{s.credits}</td>
                      <td>
                        <select value={gp} onChange={(e) => handleGradeChange(s.id, e.target.value)}>
                          <option value="">Select Grade</option>
                          {gradeOptions.map(([g, p]) => <option key={g} value={p}>{g}</option>)}
                        </select>
                      </td>
                      <td>{gp !== "" ? s.credits * Number(gp) : 0}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <div className="card grade-card">
          <h3>Grade Scale</h3>
          <table>
            <thead><tr><th>Grade</th><th>Point</th></tr></thead>
            <tbody>{gradeOptions.map(([g, p]) => <tr key={g}><td>{g}</td><td>{p}</td></tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-item"><span>SGPA</span><h2>{estimatedSGPA}</h2></div>
        <div className="summary-item"><span>Total Credits</span><h2>{totalCredits}</h2></div>
        <div className="summary-item"><span>CGPA</span><h2>{estimatedCGPA}</h2></div>
      </div>
    </div>
  );
};

export default GPA;