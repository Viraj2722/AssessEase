import axios from "axios";
import { API_URL } from "../lib/utils";

export async function loginUser(email, password, role) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
      role
    });
    
    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.data));
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error) {
    
      // Something happened in setting up the request
      throw new Error('Login request failed. Please try again.');
    
  }
}
export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  
  const userString = localStorage.getItem("user");
  if (!userString) return null;
  
  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

export function logout() {
  localStorage.removeItem("user");
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}

export function getUserRole() {
  const user = getCurrentUser();
  return user?.user?.role || null;
}
