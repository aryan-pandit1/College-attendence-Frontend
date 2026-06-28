import api from "./axiosInstance";

/* ===========================
   CGPA & SGPA
=========================== */

// Get current academic summary
export const getAcademicSummary = async () => {
  const response = await api.get("/academics/summary/");
  return response.data;
};

// Get current CGPA
export const getCGPA = async () => {
  const response = await api.get("/academics/cgpa/");
  return response.data;
};

// Get SGPA of a semester
export const getSGPA = async (semester) => {
  const response = await api.get(
    `/academics/sgpa/${semester}/`
  );

  return response.data;
};


/* ===========================
   Subjects
=========================== */

// Get current semester subjects
export const getCurrentSemesterSubjects = async () => {
  const response = await api.get(
    "/academics/current-semester/"
  );

  return response.data;
};

// Get subjects of a semester
export const getSemesterSubjects = async (
  semester
) => {
  const response = await api.get(
    `/academics/semester/${semester}/`
  );

  return response.data;
};


/* ===========================
   GPA Calculator
=========================== */

// Calculate SGPA
export const calculateSGPA = async (
  subjects
) => {
  const response = await api.post(
    "/academics/calculate-sgpa/",
    {
      subjects,
    }
  );

  return response.data;
};

// Calculate CGPA
export const calculateCGPA = async (
  semesters
) => {
  const response = await api.post(
    "/academics/calculate-cgpa/",
    {
      semesters,
    }
  );

  return response.data;
};


/* ===========================
   Target CGPA
=========================== */

// Calculate required SGPA
export const calculateTargetCGPA =
  async (targetCgpa, remainingSemesters) => {
    const response = await api.post(
      "/academics/target-cgpa/",
      {
        target_cgpa: targetCgpa,
        remaining_semesters:
          remainingSemesters,
      }
    );

    return response.data;
  };


/* ===========================
   Graphs
=========================== */

// CGPA Trend Graph
export const getCGPATrend = async () => {
  const response = await api.get(
    "/academics/cgpa-trend/"
  );

  return response.data;
};

// Semester-wise SGPA graph
export const getSGPATrend = async () => {
  const response = await api.get(
    "/academics/sgpa-trend/"
  );

  return response.data;
};


/* ===========================
   Grade Scale
=========================== */

// Grade Scale
export const getGradeScale = async () => {
  const response = await api.get(
    "/academics/grade-scale/"
  );

  return response.data;
};


/* ===========================
   Academic History
=========================== */

// Complete academic history
export const getAcademicHistory =
  async () => {
    const response = await api.get(
      "/academics/history/"
    );

    return response.data;
  };