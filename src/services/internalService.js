
import api from "./axiosInstance";

/* ===========================
   Internals Overview
=========================== */

// Overall internals summary
export const getInternalsSummary = async () => {
  const response = await api.get("/internals/summary/");
  return response.data;
};


/* ===========================
   Subjects
=========================== */

// Get all subjects
export const getSubjects = async () => {
  const response = await api.get("/internals/subjects/");
  return response.data;
};

// Get one subject details
export const getSubjectDetails = async (subjectId) => {
  const response = await api.get(
    `/internals/subjects/${subjectId}/`
  );

  return response.data;
};


/* ===========================
   Assessments
=========================== */

// Get assessments of a subject
export const getAssessments = async (subjectId) => {
  const response = await api.get(
    `/internals/assessments/${subjectId}/`
  );

  return response.data;
};

// Update marks of an assessment
export const updateAssessmentMarks = async (
  assessmentId,
  obtainedMarks
) => {
  const response = await api.put(
    `/internals/assessments/${assessmentId}/`,
    {
      obtained_marks: obtainedMarks,
    }
  );

  return response.data;
};

// Create assessment
export const createAssessment = async (
  assessmentData
) => {
  const response = await api.post(
    "/internals/assessments/",
    assessmentData
  );

  return response.data;
};

// Delete assessment
export const deleteAssessment = async (
  assessmentId
) => {
  const response = await api.delete(
    `/internals/assessments/${assessmentId}/`
  );

  return response.data;
};


/* ===========================
   Prediction
=========================== */

// Predicted internal marks
export const getPrediction = async (
  subjectId
) => {
  const response = await api.get(
    `/internals/prediction/${subjectId}/`
  );

  return response.data;
};


/* ===========================
   Progress
=========================== */

// Progress graph
export const getProgressGraph = async (
  subjectId
) => {
  const response = await api.get(
    `/internals/graph/${subjectId}/`
  );

  return response.data;
};

// Overall progress
export const getOverallProgress =
  async () => {
    const response = await api.get(
      "/internals/progress/"
    );

    return response.data;
  };


/* ===========================
   Statistics
=========================== */

// Highest marks
export const getHighestMarks =
  async () => {
    const response = await api.get(
      "/internals/highest/"
    );

    return response.data;
  };

// Average marks
export const getAverageMarks =
  async () => {
    const response = await api.get(
      "/internals/average/"
    );

    return response.data;
  };


/* ===========================
   Max Marks
=========================== */

// Update maximum marks
export const updateMaxMarks =
  async (
    assessmentId,
    maxMarks
  ) => {
    const response = await api.put(
      `/internals/max-marks/${assessmentId}/`,
      {
        max_marks: maxMarks,
      }
    );

    return response.data;
  };