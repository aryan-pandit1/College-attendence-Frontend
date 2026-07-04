import axiosInstance from "./axiosInstance";

export const getTimetable = () =>
  axiosInstance.get("timetable/");

export const addTimetable = (data) =>
  axiosInstance.post("timetable/", data);

export const updateTimetable = (id, data) =>
  axiosInstance.put(`timetable/${id}/`, data);

export const deleteTimetable = (id) =>
  axiosInstance.delete(`timetable/${id}/`);