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

  // ⚡ NEW: Global state to hold the user's default semester ID
  const [currentSemesterId, setCurrentSemesterId] = useState("");

  // Dynamic profile refresh function that feeds data straight into your context state
  const refreshStudentProfile = async () => {
    try {
      if (localStorage.getItem("access") || sessionStorage.getItem("access")) {
        const res = await getProfile();
        const data = res.data;
        
        setStudent((prevStudent) => ({
          ...prevStudent,
          name: data.name || prevStudent.name,
          email: data.email || "",
          phone: data.phone || "",
          profileImage: data.profile_image || "",
        }));

        // ⚡ NEW: Safely extract the semester ID whether Django sends an object {id: 2} or just a number (2)
        const semData = data.current_semester;
        const semId = typeof semData === "object" && semData !== null ? semData.id : semData;
        setCurrentSemesterId(String(semId || ""));
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
      value={{ 
        student, 
        setStudent, 
        refreshStudentProfile,
        currentSemesterId,     // ⚡ Exported so Attendance & Dashboard can set their default dropdowns
        setCurrentSemesterId   // ⚡ Exported so Profile.jsx can update it instantly on Save
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};