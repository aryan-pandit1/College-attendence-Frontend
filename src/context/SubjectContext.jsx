import { createContext, useContext, useEffect, useState } from "react";
import { getCourses } from "../services/courseService";

const SubjectContext = createContext();

export const SubjectProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

const fetchCourses = async () => {
    try {
      const response = await getCourses();
      
      // ⚡ STRICT ARRAY VALIDATION
      const data = response.data;
      
      // Check if data itself is an array, OR if data.results is an array. If neither, fallback to empty array [].
      const rawCourses = Array.isArray(data) 
        ? data 
        : (Array.isArray(data?.results) ? data.results : []);

      // Now we know with 100% certainty that rawCourses is an array.
      const formattedCourses = rawCourses.map(course => ({
        id: course.id,
        name: course.course_name,
        code: course.course_code,
        semester: course.semester,
        credits: course.credits,
        attendance: {
          present: 0,
          absent: 0,
          percentage: 0,
          history: [],
        },
        internals: {
          assessments: [],
        },
        grades: {
          grade: "",
          gradePoint: 0,
        },
      }));

      setSubjects(formattedCourses);
    } catch (err) {
      console.error("Failed to fetch courses in SubjectContext:", err);
    }
  };


  const addSubject = (subject) => {
    const newSubject = {
      id: Date.now(),
      name: subject.name, 
      code: subject.code,
      credits: Number(subject.credits),
      semester: Number(subject.semester),
      attendance: {
        present: 0,
        absent: 0,
        percentage: 0,
        history: [],
      },
      internals: {
        assessments: [
          { name: "Mid-Sem Exam", maxMarks: 30, obtained: 0 },
          { name: "Quiz 1", maxMarks: 10, obtained: 0 },
          { name: "Quiz 2", maxMarks: 10, obtained: 0 },
          { name: "Lab 1", maxMarks: 10, obtained: 0 },
          { name: "Lab 2", maxMarks: 10, obtained: 0 },
          { name: "Assignment", maxMarks: 10, obtained: 0 },
          { name: "Attendance", maxMarks: 10, obtained: 0 },
        ],
      },
      grades: {
        grade: "",
        gradePoint: 0,
      },
    };

    setSubjects((prev) => [...prev, newSubject]);
  };

  const editSubject = (id, updatedData) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== id) return sub;

        return {
          ...sub,
          ...updatedData,
          attendance: {
            ...sub.attendance,
            ...updatedData.attendance,
          },
          internals: {
            ...sub.internals,
            ...updatedData.internals,
          },
          grades: {
            ...sub.grades,
            ...updatedData.grades,
          },
        };
      })
    );
  };

  const deleteSubject = (id) => {
    setSubjects((prev) => prev.filter((sub) => sub.id !== id));
  };

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        addSubject,
        editSubject,
        deleteSubject,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjects = () => useContext(SubjectContext);