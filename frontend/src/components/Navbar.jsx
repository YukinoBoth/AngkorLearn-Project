// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">AngkorLearn</Link>
      </div>
      <div className="nav-right">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/subjects/math" className="nav-link">Subjects</Link>
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="btn-ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}