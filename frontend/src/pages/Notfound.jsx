// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page">
      <h1>404 — Not Found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/" className="btn">Go home</Link>
    </div>
  );
}
