import api from "./axiosInstance";

/* ===========================
   Authentication
=========================== */

// Login
export const login = async (email, password) => {
  const response = await api.post("/auth/login/", {
    email,
    password,
  });

  // Save JWT Tokens
  if (response.data.access) {
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    localStorage.setItem("loggedIn", "true");
  }

  return response.data;
};


// Register
export const register = async (userData) => {
  const response = await api.post(
    "/auth/register/",
    userData
  );

  return response.data;
};


// Logout
export const logout = async () => {
  try {
    const refresh = localStorage.getItem("refresh");

    if (refresh) {
      await api.post("/auth/logout/", {
        refresh,
      });
    }
  } catch (error) {
    console.error("Logout Error:", error);
  } finally {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("student");
  }
};


/* ===========================
   User Profile
=========================== */

// Get Logged-in Student
export const getProfile = async () => {
  const response = await api.get(
    "/auth/profile/"
  );

  return response.data;
};


// Update Profile
export const updateProfile = async (
  profileData
) => {
  const response = await api.put(
    "/auth/profile/",
    profileData
  );

  return response.data;
};


/* ===========================
   Password Management
=========================== */

// Change Password
export const changePassword = async (
  oldPassword,
  newPassword
) => {
  const response = await api.post(
    "/auth/change-password/",
    {
      old_password: oldPassword,
      new_password: newPassword,
    }
  );

  return response.data;
};


// Forgot Password
export const forgotPassword = async (
  email
) => {
  const response = await api.post(
    "/auth/forgot-password/",
    {
      email,
    }
  );

  return response.data;
};


// Reset Password
export const resetPassword = async (
  token,
  password
) => {
  const response = await api.post(
    "/auth/reset-password/",
    {
      token,
      password,
    }
  );

  return response.data;
};


/* ===========================
   Token Utilities
=========================== */

// Check Login
export const isAuthenticated = () => {
  return !!localStorage.getItem("access");
};


// Get Access Token
export const getAccessToken = () => {
  return localStorage.getItem("access");
};


// Get Refresh Token
export const getRefreshToken = () => {
  return localStorage.getItem("refresh");
};