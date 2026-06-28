
import api from "./axiosInstance";

/* ===========================
   Attendance Summary
=========================== */

// Overall attendance for dashboard
export const getAttendanceSummary = async () => {
  const response = await api.get("/attendance/summary/");
  return response.data;
};


/* ===========================
   Subjects
=========================== */

// Get all subjects with attendance
export const getSubjects = async () => {
  const response = await api.get("/attendance/subjects/");
  return response.data;
};

// Get attendance of one subject
export const getSubjectAttendance = async (subjectId) => {
  const response = await api.get(
    `/attendance/subjects/${subjectId}/`
  );

  return response.data;
};


/* ===========================
   Attendance History
=========================== */

// Attendance history of a subject
export const getAttendanceHistory = async (subjectId) => {
  const response = await api.get(
    `/attendance/history/${subjectId}/`
  );

  return response.data;
};


/* ===========================
   Mark Attendance
=========================== */

// Mark Present
export const markPresent = async (subjectId) => {
  const response = await api.post(
    `/attendance/mark/`,
    {
      subject: subjectId,
      status: "Present",
    }
  );

  return response.data;
};

// Mark Absent
export const markAbsent = async (subjectId) => {
  const response = await api.post(
    `/attendance/mark/`,
    {
      subject: subjectId,
      status: "Absent",
    }
  );

  return response.data;
};

// Mark OD
export const markOD = async (subjectId) => {
  const response = await api.post(
    `/attendance/mark/`,
    {
      subject: subjectId,
      status: "OD",
    }
  );

  return response.data;
};


/* ===========================
   Analytics
=========================== */

// Safe classes that can be skipped
export const getSafeClasses = async (subjectId) => {
  const response = await api.get(
    `/attendance/skip/${subjectId}/`
  );

  return response.data;
};

// Attendance graph
export const getAttendanceGraph = async (subjectId) => {
  const response = await api.get(
    `/attendance/graph/${subjectId}/`
  );

  return response.data;
};


/* ===========================
   Dashboard
=========================== */

// Today's attendance status
export const getTodayAttendance = async () => {
  const response = await api.get(
    "/attendance/today/"
  );

  return response.data;
};