import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user: userData } = res.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  const googleLogin = async (googleToken) => {
    try {
      const res = await API.post("/auth/google", { token: googleToken });
      const { token, user: userData } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.error("Google login error:", err);
      return { success: false, message: err.response?.data?.message || "Google login failed" };
    }
  };

  const register = async (userData) => {
    try {
      const res = await API.post("/auth/register", userData);
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await API.post("/auth/forgot-password", { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      console.error("Forgot password error:", err);
      const message = err.response?.data?.message || (err.request ? "Server is unreachable. Is the backend running?" : "Something went wrong");
      return { success: false, message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const res = await API.post("/auth/reset-password", { token, password });
      return { success: true, message: res.data.message };
    } catch (err) {
      console.error("Reset password error:", err);
      const message = err.response?.data?.message || (err.request ? "Server is unreachable. Is the backend running?" : "Something went wrong");
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, logout, register, forgotPassword, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
