import axiosInstance from "./axiosInstance";

export const getTimetable = () =>
  axiosInstance.get("timetable/");

export const addClass = (data) =>
  axiosInstance.post("timetable/", data);