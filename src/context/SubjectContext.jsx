import { createContext, useContext, useEffect, useState } from "react";

const SubjectContext = createContext();

export const SubjectProvider = ({ children }) => {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("subjects");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
    console.log("Subjects Saved:", subjects);
  }, [subjects]);

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
    setSubjects((prev) =>
      prev.filter((sub) => sub.id !== id)
    );
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