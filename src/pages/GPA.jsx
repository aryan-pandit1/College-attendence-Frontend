import { useState, useEffect, useMemo } from "react";
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

const GPA = () => {

  const [subjects, setSubjects] = useState([]);

  const [semesters, setSemesters] = useState([]);

  const [grades, setGrades] = useState([]);

  const [selectedSemester, setSelectedSemester] =
    useState(null);

  const [sgpa, setSGPA] = useState(0);

  const [cgpa, setCGPA] = useState(0);

  // -------------------------
  // Target Calculator
  // -------------------------

  const [currentCGPA, setCurrentCGPA] =
    useState(8.2);

  const [completedSemesters, setCompletedSemesters] =
    useState(5);

  const [remainingSemesters, setRemainingSemesters] =
    useState(3);

  const [targetCGPA, setTargetCGPA] =
    useState(9);

  // -------------------------
  // Load Data
  // -------------------------

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

  const loadCourses = async () => {

    try {

      const res = await getCourses();

      const data =
        res.data.results || res.data;

      setSubjects(data);

    } catch (err) {

      console.log(err);

    }

  };

  const loadSemesters = async () => {

    try {

      const res = await getSemesters();

      const data =
        res.data.results || res.data;

      setSemesters(data);

      if (data.length > 0) {

        setSelectedSemester(data[0].id);

      }

    } catch (err) {

      console.log(err);

    }

  };

  const loadGrades = async () => {

    try {

      const res = await getGrades();

      const data =
        res.data.results || res.data;

      const filtered = data.filter(

        grade =>
          grade.semester ===
          selectedSemester

      );

      setGrades(filtered);

    } catch (err) {

      console.log(err);

    }

  };

  const loadSGPA = async () => {

    try {

      const res =
        await getSGPA(selectedSemester);

      setSGPA(res.data.sgpa);

    } catch (err) {

      console.log(err);

    }

  };

  const loadCGPA = async () => {

    try {

      const res = await getCGPA();

      setCGPA(res.data.cgpa);

      setCurrentCGPA(res.data.cgpa);

    } catch (err) {

      console.log(err);

    }

  };

  const semesterSubjects = useMemo(() => {

    return grades.map((grade) => {

      const subject =
        subjects.find(
          s => s.id === grade.course
        );

      return {

        ...grade,

        subject,

      };

    });

  }, [grades, subjects]);
  // -------------------------
  // Grade Update
  // -------------------------

  const handleGradeChange = async (
    grade,
    gradeLetter
  ) => {

    try {

      await updateGrade(
        grade.id,
        {
          ...grade,
          grade_point:
            gradeScale[gradeLetter],
        }
      );

      loadGrades();

      loadSGPA();

      loadCGPA();

    } catch (err) {

      console.log(err);

    }

  };

  // -------------------------
  // Calculations
  // -------------------------

  const totalCredits =
    semesterSubjects.reduce(

      (sum, item) =>

        sum +
        (item.subject?.credits || 0),

      0

    );

  const estimatedSGPA =
    sgpa
      ? Number(sgpa).toFixed(2)
      : "0.00";

  const estimatedCGPA =
    cgpa
      ? Number(cgpa).toFixed(2)
      : "0.00";

  const calculatedRequiredSGPA =

    remainingSemesters === 0

      ? 0

      :

      (

        targetCGPA *

        (

          completedSemesters +

          remainingSemesters

        )

        -

        currentCGPA *

        completedSemesters

      )

      /

      remainingSemesters;

  const requiredSGPA =

    calculatedRequiredSGPA > 10

      ? "Impossible"

      : Math.max(

          0,

          calculatedRequiredSGPA

        ).toFixed(2);

  // -------------------------
  // SGPA Trend
  // -------------------------

  const cgpaTrend =
    semesters.map(

      (_, index) =>

        index + 1 <= completedSemesters

          ? currentCGPA

          : 0

    );

  const gradeOptions =
    Object.entries(gradeScale);

    return (
  <div className="gpa-page">

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

    {/* ------------------ TOP ------------------ */}

    <div className="gpa-top">

      <div className="card trend-card">

        <h3>SGPA Trend</h3>

        <div className="chart">

          {cgpaTrend.map((value, index) => (

            <div
              key={index}
              className="bar-item"
            >

              <span>{value}</span>

              <div
                className="bar"
                style={{
                  height: `${value * 22}px`,
                }}
              />

              <p>Sem {index + 1}</p>

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

    {/* ------------------ SUBJECT TABLE ------------------ */}

    <div className="gpa-middle">

      <div className="card subjects-card">

        <h3>Semester Subjects</h3>

        <table>

          <thead>

            <tr>

              <th>Subject</th>

              <th>Credits</th>

              <th>Grade Point</th>

            </tr>

          </thead>

          <tbody>

            {semesterSubjects.map((item) => (

              <tr key={item.id}>

                <td>
                  {item.subject?.course_name}
                </td>

                <td>
                  {item.subject?.credits}
                </td>

                <td>

                  <select
                    value={item.grade_point}
                    onChange={(e) =>
                      handleGradeChange(
                        item,
                        Number(e.target.value)
                      )
                    }
                  >

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

              </tr>

            ))}

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

    {/* ------------------ SUMMARY ------------------ */}

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