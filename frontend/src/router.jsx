// src/router.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Math from "./pages/Subjects/Math";
import Physics from "./pages/Subjects/Physics/Physics";
import Chemistry from "./pages/Subjects/Chemistry";
import Biology from "./pages/Subjects/Biology";
import NotFound from "./pages/Notfound";

export default function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

    {/* DASHBOARD AS HOME */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD (PROTECTED) */}

<Route path="/dashboard" element={<Navigate to="/" replace />} />

        {/* SUBJECTS (PROTECTED) */}
        <Route
          path="/subjects/math"
          element={
            <ProtectedRoute>
              <Math />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects/physics"
          element={
            <ProtectedRoute>
              <Physics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects/chemistry"
          element={
            <ProtectedRoute>
              <Chemistry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects/biology"
          element={
            <ProtectedRoute>
              <Biology />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
