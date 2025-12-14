// src/pages/Subjects/Physics.jsx
import React from "react";

export default function Physics() {
  return (
    <div className="page">
      <h1>Physics Lab</h1>
      <p>Small interactive experiments.</p>
      <div className="module">
        <h3>Free Fall Simulator</h3>
        <div className="placeholder">Adjust gravity and mass to see effects.</div>
      </div>
      <div className="module">
        <h3>Projectile Motion</h3>
        <div className="placeholder">Angle & velocity controls.</div>
      </div>
    </div>
  );
}
