import { useState, useEffect } from "react";
import "./GPA.css";

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
  AA: 10,
  AB: 9,
  BB: 8,
  BC: 7,
  CC: 6,
  CD: 5,
  DD: 4,
  F: 0,
};

// Accept darkMode prop sent down from App.jsx routing configurations
const GPA = ({ darkMode }) => {

  const [subjects, setSubjects] = useState([]);

  const [semesters, setSemesters] = useState([]);

  const [grades, setGrades] = useState([]);

  const [selectedSemester, setSelectedSemester] =
    useState(null);

  const [sgpa, setSGPA] = useState(0);

  const [cgpa, setCGPA] = useState(0);

  const [graphData, setGraphData] = useState([]);

  // Target Calculator

  const [currentCGPA, setCurrentCGPA] =
    useState(0);

  const [completedSemesters, setCompletedSemesters] =
    useState(1);

  const [remainingSemesters, setRemainingSemesters] =
    useState(7);

  const [targetCGPA, setTargetCGPA] =
    useState(9);

  useEffect(() => {

    loadCourses();

    loadSemesters();

    loadCGPA();

  }, []);

  useEffect(() => {

    if (selectedSemester) {

      loadGrades();

      loadSGPA();

    }

  }, [selectedSemester]);

  // Sync graph candles data calculation trigger automatically when semesters resolve
  useEffect(() => {
    if (semesters.length > 0) {
      loadGraph(semesters); // Pass semesters directly to avoid state batching delays
    }
  }, [semesters]);

  // -------------------------
  // Courses
  // -------------------------

  const loadCourses = async () => {

    try {

      const res = await getCourses();

      const data =
        res.data.results || res.data;

      setSubjects(data);

    }

    catch (err) {
      // Handled gracefully internally
    }

  };

  // -------------------------
  // Semesters
  // -------------------------

  const loadSemesters = async () => {

    try {

      const res = await getSemesters();

      const data =
        res.data.results || res.data;

    setSemesters(data);

    if (data.length > 0) {

        setSelectedSemester(data[0].id);

    }

    }

    catch (err) {
      // Handled gracefully internally
    }

  };

  // -------------------------
  // Grades
  // -------------------------

  const loadGrades = async () => {

    try {

      const res = await getGrades();

      const data =
        res.data.results || res.data;

      setGrades(data);

    }

    catch (err) {
      // Handled gracefully internally
    }

  };

  // -------------------------
  // GPA
  // -------------------------

  const loadSGPA = async () => {

    try {

      const res =
        await getSGPA(selectedSemester);

      setSGPA(res.data.sgpa || 0);

    }

    catch (err) {

      setSGPA(0);

    }

  };

  const loadCGPA = async () => {

    try {

      const res = await getCGPA();

      setCGPA(res.data.cgpa || 0);

      setCurrentCGPA(
        res.data.cgpa || 0
      );

    }

    catch (err) {

      setCGPA(0);

    }

  };

  // Accept targets array parameter so we can bypass state initialization lag frames
  const loadGraph = async (targetSemesters = semesters) => {

  const graph = [];

  for (const semester of targetSemesters) {

    try {

      const res = await getSGPA(semester.id);

      graph.push({
        semester: `Sem ${semester.semester_number}`,
        sgpa: Number(res.data.sgpa || 0),
      });

    }

    catch {

      graph.push({
        semester: `Sem ${semester.semester_number}`,
        sgpa: 0,
      });

    }

  }

  setGraphData(graph);

};

    // -------------------------
  // Subjects of Selected Semester
  // -------------------------

  const semesterSubjects =
    subjects.filter((subject) => {

      const semester = semesters.find(
  (sem) => sem.id === selectedSemester
);

if (!semester) return;

      if (!semester) return false;

      return (
        subject.semester ===
        semester.semester_number
      );

    });

  // -------------------------
  // Grade Change
  // -------------------------

  const handleGradeChange = async (
    courseId,
    gradePoint
  ) => {
     if (gradePoint === "") return;
     
    try {

      const semester = semesters.find(
        (sem) =>
          sem.id === selectedSemester
      );

      const existingGrade =
        grades.find(
          (g) =>
            g.course === courseId &&
            g.semester ===
              selectedSemester
        );

      if (existingGrade) {

        await updateGrade(
          existingGrade.id,
          {
            semester:
              selectedSemester,

            course: courseId,

            grade_point:
              Number(gradePoint),
          }
        );

      } else {

        await addGrade({

          semester:
            selectedSemester,

          course: courseId,

          grade_point:
            Number(gradePoint),

        });

      }

      loadGrades();

      loadSGPA();

      loadCGPA();
      
      // FIXED: Refresh trend visual metrics graph live as changes hit the DB!
      loadGraph();

    } catch (err) {
      // Handled gracefully internally
    }

  };

  // -------------------------
  // Helpers
  // -------------------------

  const getGradePoint = (
    courseId
  ) => {

    const record =
      grades.find(
        (g) =>
          g.course === courseId &&
          g.semester ===
            selectedSemester
      );

    return record
      ? record.grade_point
      : "";

  };

  const totalCredits =
    semesterSubjects.reduce(
      (sum, subject) =>
        sum + subject.credits,
      0
    );

  const estimatedSGPA =
    Number(sgpa).toFixed(2);

  const estimatedCGPA =
    Number(cgpa).toFixed(2);

  const calculatedRequiredSGPA =
    remainingSemesters === 0
      ? 0
      :
        (
          targetCGPA *
            (
              completedSemesters +
              remainingSemesters
            ) -
          currentCGPA *
            completedSemesters
        ) /
        remainingSemesters;

  const requiredSGPA =
    calculatedRequiredSGPA > 10
      ? "Impossible"
      : Math.max(
          0,
          calculatedRequiredSGPA
        ).toFixed(2);

  const gradeOptions =
    Object.entries(
      gradeScale
    );

    return (
  <div className={`gpa-page ${darkMode ? "forced-dark" : ""}`}>

    <div className="gpa-header">

      <h1>GPA Calculator</h1>

      <div className="semester-select">

        <label>Semester</label>

        <select
          value={selectedSemester || ""}
          onChange={(e) =>
            setSelectedSemester(
              Number(e.target.value)
            )
          }
        >

          {semesters.map((semester) => (

            <option
              key={semester.id}
              value={semester.id}
            >
              Semester {semester.semester_number}
            </option>

          ))}

        </select>

      </div>

    </div>

    {/* ---------------- TOP ---------------- */}

    <div className="gpa-top">

     <div className="card trend-card">

  <h3>SGPA Trend</h3>

  <div className="chart">

    {graphData.map((item) => (

      <div
        key={item.semester}
        className="bar-item"
      >

        <span>{item.sgpa.toFixed(2)}</span>

        <div
          className="bar"
          style={{
            height: `${item.sgpa * 22}px`,
          }}
        />

        <p>{item.semester}</p>

      </div>

    ))}

  </div>

</div>
      <div className="card target-card">

        <h3>🎯 Target CGPA Calculator</h3>

        <div className="target-row">

          <span>Current CGPA</span>

          <input
            type="number"
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

      </div>

    </div>

    {/* ---------------- SUBJECTS ---------------- */}

    <div className="gpa-middle">

      <div className="card subjects-card">

        <h3>Semester Subjects</h3>

        <table>

          <thead>

            <tr>

              <th>Subject</th>

              <th>Credits</th>

              <th>Grade Point</th>
              
              <th>Points</th>

            </tr>

          </thead>

          <tbody>

            {semesterSubjects.length === 0 ? (

              <tr>

                <td colSpan="4">

                  No subjects in this semester.

                </td>

              </tr>

            ) : (

              semesterSubjects.map((subject) => {
                const currentGradePoint = getGradePoint(subject.id);
                const calculatedPoints = currentGradePoint !== "" ? subject.credits * Number(currentGradePoint) : 0;

                return (
                  <tr key={subject.id}>

                    <td>

                      {subject.course_name}

                    </td>

                    <td>

                      {subject.credits}

                    </td>

                    <td>

                      <select
                        value={currentGradePoint}
                        onChange={(e) =>
                          handleGradeChange(
                            subject.id,
                            e.target.value
                          )
                        }
                      >

                         <option value="">
                          Select Grade
                         </option>

                        {gradeOptions.map(
                          ([grade, point]) => (

                            <option
                              key={grade}
                              value={point}
                            >

                              {grade}

                            </option>

                          )
                        )}

                      </select>

                    </td>
                    
                    <td>
                      {calculatedPoints}
                    </td>

                  </tr>
                );
              })

            )}

          </tbody>

        </table>

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

            {gradeOptions.map(
              ([grade, point]) => (

                <tr key={grade}>

                  <td>{grade}</td>

                  <td>{point}</td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

    {/* ---------------- SUMMARY ---------------- */}

    <div className="summary-card">

      <div className="summary-item">

        <span>SGPA</span>

        <h2>{estimatedSGPA}</h2>

      </div>

      <div className="summary-item">

        <span>Total Credits</span>

        <h2>{totalCredits}</h2>

      </div>

      <div className="summary-item">

        <span>CGPA</span>

        <h2>{estimatedCGPA}</h2>

      </div>

    </div>

  </div>
);
};

export default GPA;