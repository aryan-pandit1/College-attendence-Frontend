import axiosInstance from "./axiosInstance";

export const getInternals = () =>
  axiosInstance.get("internals/");

export const addInternal = (data) =>
  axiosInstance.post("internals/", data);

export const getInternalScore = (courseId) =>
  axiosInstance.get(`internals/score/${courseId}/`);