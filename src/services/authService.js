import axiosInstance from "./axiosInstance";

export const login = (username, password) =>
  axiosInstance.post("accounts/login/", {
    username,
    password,
  });

export const register = (data) =>
  axiosInstance.post("accounts/register/", data);