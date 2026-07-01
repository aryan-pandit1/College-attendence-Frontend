import axios from "axios";

const API = "http://127.0.0.1:8000/api/courses/";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
});

export const getCourses = () =>
  axios.get(API, authHeader());

export const addCourse = (course) =>
  axios.post(API, course, authHeader());

export const updateCourse = (id, course) =>
  axios.put(`${API}${id}/`, course, authHeader());

export const deleteCourse = (id) =>
  axios.delete(`${API}${id}/`, authHeader());