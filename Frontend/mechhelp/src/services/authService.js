import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getEndpoint = (userType, action) => `${API_BASE_URL}/${userType}/${action}`;

export const register = async (userType, data) => {
  const res = await axios.post(getEndpoint(userType, "register"), data);
  return res.data;
};

export const login = async (userType, credentials) => {
  const res = await axios.post(getEndpoint(userType, "login"), credentials);
  return res.data;
};
