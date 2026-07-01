import { createContext, useState } from "react";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState({
    name: "Arjun",
    cgpa: 8.24,
    credits: 72,

    attendance: {
      present: 123,
      absent: 28,
      od: 6,
    }, 

    internals: {
      ds: 75,
      os: 82,
      dbms: 79,
      cn: 84,
    },
  });

  return (
    <StudentContext.Provider
      value={{ student, setStudent }}
    >
      {children}
    </StudentContext.Provider>
  );
};