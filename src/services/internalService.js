import axiosInstance from "./axiosInstance";

export const getInternals = () =>
  axiosInstance.get("internals/");

export const addInternal = (data) =>
  axiosInstance.post("internals/", data);

export const updateInternal = (id, data) =>
  axiosInstance.put(`internals/${id}/`, data);

export const deleteInternal = (id) =>
  axiosInstance.delete(`internals/${id}/`);

export const getInternalScore = (courseId) =>
  axiosInstance.get(`internals/score/${courseId}/`);