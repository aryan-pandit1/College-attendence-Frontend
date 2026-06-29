import axiosInstance from "./axiosInstance";

// Get all timetable entries
export const getCalendar = () =>
  axiosInstance.get("timetable/");

// Add a new class
export const addClass = (data) =>
  axiosInstance.post("timetable/", data);

// Update a class
export const updateClass = (id, data) =>
  axiosInstance.put(`timetable/${id}/`, data);

// Delete a class
export const deleteClass = (id) =>
  axiosInstance.delete(`timetable/${id}/`);