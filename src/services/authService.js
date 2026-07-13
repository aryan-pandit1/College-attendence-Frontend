import axiosInstance from "./axiosInstance";

export const login = (username, password) =>
  axiosInstance.post("accounts/login/", {
    username,
    password,
  });

export const register = (data) =>
  axiosInstance.post("accounts/register/", data);

export const sendRegistrationOTP = (data) =>
  axiosInstance.post(
    "accounts/register/send-otp/",
    data
  );

export const verifyRegistrationOTP = (data) =>
  axiosInstance.post(
    "accounts/register/verify-otp/",
    data
  );

export const resendRegistrationOTP = (email) =>
  axiosInstance.post(
    "accounts/register/resend-otp/",
    {
      email,
    }
  );

  export const forgotPassword = (email) =>
  axiosInstance.post("accounts/forgot-password/", {
    email,
  });

export const verifyForgotOTP = (data) =>
  axiosInstance.post(
    "accounts/verify-otp/",
    data
  );

export const resetPassword = (data) =>
  axiosInstance.post(
    "accounts/reset-password/",
    data
  );