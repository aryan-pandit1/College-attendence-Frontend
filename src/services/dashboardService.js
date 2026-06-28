import api from "./axiosInstance";

/* ===========================
   Dashboard Summary
=========================== */

// Dashboard overview
export const getDashboard = async () => {
  const response = await api.get("/dashboard/");
  return response.data;
};


/* ===========================
   Student Overview
=========================== */

// Student profile summary
export const getStudentOverview = async () => {
  const response = await api.get(
    "/dashboard/profile/"
  );

  return response.data;
};


/* ===========================
   Attendance
=========================== */

// Overall attendance card
export const getAttendanceCard =
  async () => {
    const response = await api.get(
      "/dashboard/attendance/"
    );

    return response.data;
  };


/* ===========================
   Academics
=========================== */

// CGPA card
export const getCGPACard = async () => {
  const response = await api.get(
    "/dashboard/cgpa/"
  );

  return response.data;
};

// Credits card
export const getCreditsCard =
  async () => {
    const response = await api.get(
      "/dashboard/credits/"
    );

    return response.data;
  };

// Internals card
export const getInternalsCard =
  async () => {
    const response = await api.get(
      "/dashboard/internals/"
    );

    return response.data;
  };


/* ===========================
   Timetable
=========================== */

// Today's schedule
export const getTodaySchedule =
  async () => {
    const response = await api.get(
      "/dashboard/schedule/"
    );

    return response.data;
  };


/* ===========================
   Attendance Actions
=========================== */

// Mark attendance from dashboard
export const markAttendance =
  async (classId, status) => {
    const response = await api.post(
      "/dashboard/attendance/mark/",
      {
        class_id: classId,
        status,
      }
    );

    return response.data;
  };


/* ===========================
   Attendance Analytics
=========================== */

// Safe-to-skip calculation
export const getSafeToSkip =
  async () => {
    const response = await api.get(
      "/dashboard/safe-to-skip/"
    );

    return response.data;
  };


/* ===========================
   Deadlines
=========================== */

// Upcoming deadlines
export const getUpcomingDeadlines =
  async () => {
    const response = await api.get(
      "/dashboard/deadlines/"
    );

    return response.data;
  };


/* ===========================
   Notifications
=========================== */

// Notifications
export const getNotifications =
  async () => {
    const response = await api.get(
      "/dashboard/notifications/"
    );

    return response.data;
  };


/* ===========================
   Graphs
=========================== */

// Dashboard performance graph
export const getPerformanceGraph =
  async () => {
    const response = await api.get(
      "/dashboard/performance-graph/"
    );

    return response.data;
  };


/* ===========================
   Refresh Dashboard
=========================== */

// Fetch everything in one request
export const refreshDashboard =
  async () => {
    const response = await api.get(
      "/dashboard/refresh/"
    );

    return response.data;
  };