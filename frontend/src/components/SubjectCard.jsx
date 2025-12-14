// src/components/SubjectCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function SubjectCard({ title, description, to }) {
  return (
    <Link to={to} className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="card-cta">Explore →</div>
    </Link>
  );
}
