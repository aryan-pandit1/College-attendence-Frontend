import axiosInstance from "../services/axiosInstance";

export const getProfile = () =>
  axiosInstance.get("accounts/profile/");

export const updateProfile = (data) =>
  axiosInstance.put("accounts/profile/", data);

export const uploadProfileImage = (formData) =>
  axiosInstance.patch(
    "accounts/profile/upload-image/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const changePassword = (data) =>
  axiosInstance.post(
    "accounts/profile/change-password/",
    data
  );

export const deleteProfile = (password) =>
  axiosInstance.delete(
    "accounts/profile/delete/",
    {
      data: {
        password,
      },
    }
  );

  export const forgotPassword = (email) =>
  axiosInstance.post(
    "accounts/forgot-password/",
    {
      email,
    }
  );

export const verifyOTP = (data) =>
  axiosInstance.post(
    "accounts/verify-otp/",
    data
  );

export const resetPassword = (data) =>
  axiosInstance.post(
    "accounts/reset-password/",
    data
  );