// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user)); else localStorage.removeItem("user");
    if (token) localStorage.setItem("token", token); else localStorage.removeItem("token");
  }, [user, token]);

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const { data } = await API.post("/api/auth/register", { name, email, password });
      setUser({ _id: data._id, name: data.name, email: data.email });
      setToken(data.token);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err?.response?.data?.message || err.message };
    } finally { setLoading(false); }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data } = await API.post("/api/auth/login", { email, password });
      setUser({ _id: data._id, name: data.name, email: data.email });
      setToken(data.token);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err?.response?.data?.message || err.message };
    } finally { setLoading(false); }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};