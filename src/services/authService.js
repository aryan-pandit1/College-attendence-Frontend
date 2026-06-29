import axios from "axios";

const API = "http://127.0.0.1:8000/api/accounts/";

export const login = (username, password) =>
  axios.post(API + "login/", {
    username,
    password,
  });

export const register = (data) =>
  axios.post(API + "register/", data);