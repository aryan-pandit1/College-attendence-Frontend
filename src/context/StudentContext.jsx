import { createContext, useState, useEffect } from "react";
import { getProfile } from "../services/profileService";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState({
    name: "Arjun",
    email: "",         /* Added for global sync */
    phone: "",         /* Added for global sync */
    profileImage: "",  /* Added for global sync */
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

  // Dynamic profile refresh function that feeds data straight into your context state
  const refreshStudentProfile = async () => {
    try {
      if (localStorage.getItem("access")) {
        const res = await getProfile();
        const data = res.data;
        
        setStudent((prevStudent) => ({
          ...prevStudent,
          name: data.name || prevStudent.name,
          email: data.email || "",
          phone: data.phone || "",
          profileImage: data.profile_image || "",
        }));
      }
    } catch (err) {
      // Handled cleanly internally without interrupting active state pipelines
    }
  };

  // Automatically fetch profile updates on launch if authenticated
  useEffect(() => {
    refreshStudentProfile();
  }, []);

  return (
    <StudentContext.Provider
      value={{ student, setStudent, refreshStudentProfile }}
    >
      {children}
    </StudentContext.Provider>
  );
};