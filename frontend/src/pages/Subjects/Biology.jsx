// src/pages/Subjects/Biology.jsx
import React from "react";

export default function Biology() {
  return (
    <div className="page">
      <h1>Biology Explorer</h1>
      <p>3D anatomy viewer and cell diagrams.</p>
      <div className="module">
        <h3>Human Body Viewer</h3>
        <div className="placeholder">3D model will be shown here (Three.js).</div>
      </div>
      <div className="module">
        <h3>Cell Diagram</h3>
        <div className="placeholder">Interact with organelles.</div>
      </div>
    </div>
  );
}
