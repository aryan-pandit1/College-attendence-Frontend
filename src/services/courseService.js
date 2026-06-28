import api from "./axiosInstance";

/* ===========================
   Courses
=========================== */

// Get all courses
export const getCourses = async () => {
  const response = await api.get("/courses/");
  return response.data;
};

// Get course by ID
export const getCourseById = async (courseId) => {
  const response = await api.get(
    `/courses/${courseId}/`
  );

  return response.data;
};

// Get courses of a semester
export const getSemesterCourses = async (
  semester
) => {
  const response = await api.get(
    `/courses/semester/${semester}/`
  );

  return response.data;
};


/* ===========================
   Course CRUD
=========================== */

// Add new course
export const addCourse = async (courseData) => {
  const response = await api.post(
    "/courses/",
    courseData
  );

  return response.data;
};

// Update course
export const updateCourse = async (
  courseId,
  courseData
) => {
  const response = await api.put(
    `/courses/${courseId}/`,
    courseData
  );

  return response.data;
};

// Delete course
export const deleteCourse = async (
  courseId
) => {
  const response = await api.delete(
    `/courses/${courseId}/`
  );

  return response.data;
};


/* ===========================
   Credits
=========================== */

// Total credits of current semester
export const getSemesterCredits =
  async (semester) => {
    const response = await api.get(
      `/courses/credits/${semester}/`
    );

    return response.data;
  };

// Credits completed
export const getCompletedCredits =
  async () => {
    const response = await api.get(
      "/courses/credits/completed/"
    );

    return response.data;
  };


/* ===========================
   Faculty
=========================== */

// Get faculty assigned to course
export const getCourseFaculty =
  async (courseId) => {
    const response = await api.get(
      `/courses/${courseId}/faculty/`
    );

    return response.data;
  };


/* ===========================
   Search
=========================== */

// Search courses
export const searchCourses = async (
  keyword
) => {
  const response = await api.get(
    `/courses/search/?q=${keyword}`
  );

  return response.data;
};


/* ===========================
   Electives
=========================== */

// Available electives
export const getElectives =
  async () => {
    const response = await api.get(
      "/courses/electives/"
    );

    return response.data;
  };

// Register elective
export const registerElective =
  async (courseId) => {
    const response = await api.post(
      "/courses/electives/register/",
      {
        course_id: courseId,
      }
    );

    return response.data;
  };