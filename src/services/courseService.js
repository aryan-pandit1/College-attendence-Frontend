import axiosInstance from "./axiosInstance";

export const getCourses = () =>
  axiosInstance.get("courses/");

export const addCourse = (course) =>
  axiosInstance.post("courses/", course);

export const updateCourse = (id, course) =>
  axiosInstance.put(`courses/${id}/`, course);

export const deleteCourse = (id) =>
  axiosInstance.delete(`courses/${id}/`);