import api from "./axiosInstance";

/* ===========================
   Today's Timetable
=========================== */

// Get today's timetable
export const getTodayTimetable = async () => {
  const response = await api.get("/timetable/today/");
  return response.data;
};


/* ===========================
   Weekly Timetable
=========================== */

// Get weekly timetable
export const getWeeklyTimetable = async () => {
  const response = await api.get("/timetable/week/");
  return response.data;
};

// Get timetable for a specific day
export const getDayTimetable = async (day) => {
  const response = await api.get(
    `/timetable/day/${day}/`
  );

  return response.data;
};


/* ===========================
   Single Class
=========================== */

// Get one class details
export const getClassDetails = async (classId) => {
  const response = await api.get(
    `/timetable/class/${classId}/`
  );

  return response.data;
};


/* ===========================
   Manage Classes
=========================== */

// Add new class
export const addClass = async (classData) => {
  const response = await api.post(
    "/timetable/class/",
    classData
  );

  return response.data;
};

// Update class
export const updateClass = async (
  classId,
  classData
) => {
  const response = await api.put(
    `/timetable/class/${classId}/`,
    classData
  );

  return response.data;
};

// Delete class
export const deleteClass = async (
  classId
) => {
  const response = await api.delete(
    `/timetable/class/${classId}/`
  );

  return response.data;
};


/* ===========================
   Attendance from Timetable
=========================== */

// Mark attendance directly from timetable
export const markAttendance = async (
  classId,
  status
) => {
  const response = await api.post(
    "/timetable/attendance/",
    {
      class_id: classId,
      status,
    }
  );

  return response.data;
};


/* ===========================
   Upcoming Classes
=========================== */

// Next upcoming class
export const getNextClass = async () => {
  const response = await api.get(
    "/timetable/next/"
  );

  return response.data;
};


/* ===========================
   Timetable Settings
=========================== */

// Get current semester timetable
export const getSemesterTimetable =
  async (semester) => {
    const response = await api.get(
      `/timetable/semester/${semester}/`
    );

    return response.data;
  };

// Refresh timetable
export const refreshTimetable =
  async () => {
    const response = await api.get(
      "/timetable/refresh/"
    );

    return response.data;
  };