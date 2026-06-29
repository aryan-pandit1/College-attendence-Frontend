import axiosInstance from "./axiosInstance";

export const getCGPA = () =>
  axiosInstance.get("academics/cgpa/");

export const getSGPA = (semesterId) =>
  axiosInstance.get(`academics/sgpa/${semesterId}/`);