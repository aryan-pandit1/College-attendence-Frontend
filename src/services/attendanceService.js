import axiosInstance from "./axiosInstance";

export const getAttendance = () =>
  axiosInstance.get("attendance/");

export const addAttendance = (data) =>
  axiosInstance.post("attendance/", data);

export const getPrediction = (courseId) =>
  axiosInstance.get(`attendance/predict/${courseId}/`);