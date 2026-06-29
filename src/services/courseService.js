import axiosInstance from "./axiosInstance";

export const getCourses = () =>
  axiosInstance.get("courses/");

export const addCourse = (data) =>
  axiosInstance.post("courses/", data);

export const updateCourse = (id, data) =>
  axiosInstance.put(`courses/${id}/`, data);

export const deleteCourse = (id) =>
  axiosInstance.delete(`courses/${id}/`);