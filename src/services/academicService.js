import axiosInstance from "./axiosInstance";

// Semesters
export const getSemesters = () =>
  axiosInstance.get("academics/semesters/");

export const addSemester = (data) =>
  axiosInstance.post("academics/semesters/", data);

// Grades
export const getGrades = () =>
  axiosInstance.get("academics/grades/");

export const addGrade = (data) =>
  axiosInstance.post("academics/grades/", data);

export const updateGrade = (id, data) =>
  axiosInstance.put(`academics/grades/${id}/`, data);

export const deleteGrade = (id) =>
  axiosInstance.delete(`academics/grades/${id}/`);

// GPA
export const getSGPA = (semesterId) =>
  axiosInstance.get(`academics/sgpa/${semesterId}/`);

export const getCGPA = () =>
  axiosInstance.get("academics/cgpa/");