// src/components/math/Collapsible.jsx
import React, { useState } from "react";

export default function Collapsible({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="module" style={{ marginBottom: 18 }}>
      <button
        className="collapse-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span style={{ fontWeight: 700 }}>{title}</span>
        <span style={{ marginLeft: 12, color: "var(--muted)" }}>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && <div style={{ marginTop: 12 }}>{children}</div>}
    </div>
  );
}
