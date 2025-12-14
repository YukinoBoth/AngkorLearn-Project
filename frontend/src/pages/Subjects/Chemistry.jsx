// src/pages/Subjects/Chemistry.jsx
import React from "react";

export default function Chemistry() {
  return (
    <div className="page">
      <h1>Chemistry Lab</h1>
      <p>Periodic table and reaction mixer.</p>
      <div className="module">
        <h3>Interactive Periodic Table</h3>
        <div className="placeholder">Click elements to add to beaker.</div>
      </div>
      <div className="module">
        <h3>Reaction Mixer</h3>
        <div className="placeholder">Choose two elements to see reaction.</div>
      </div>
    </div>
  );
}
