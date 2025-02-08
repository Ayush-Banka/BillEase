import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // e.g., http://localhost:5000/api

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    // Store token in localStorage for subsequent requests
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Server error" };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
