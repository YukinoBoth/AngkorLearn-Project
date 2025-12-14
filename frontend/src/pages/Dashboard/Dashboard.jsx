import "./dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>AngkorLearn</h1>
        <p>
          A modern interactive learning platform for science and mathematics.
        </p>
      </header>

      <section className="dashboard-grid">
        <Link to="/subjects/math" className="dashboard-card">
          <span className="card-label">Subject</span>
          <h2>Mathematics</h2>
          <p>Geometry playgrounds, algebra solvers, and visual intuition.</p>
        </Link>

        <Link to="/subjects/physics" className="dashboard-card">
          <span className="card-label">Subject</span>
          <h2>Physics</h2>
          <p>Motion, forces, momentum, and real-time simulations.</p>
        </Link>

        <Link to="/subjects/chemistry" className="dashboard-card">
          <span className="card-label">Subject</span>
          <h2>Chemistry</h2>
          <p>Elements, reactions, and atomic-level understanding.</p>
        </Link>

        <Link to="/subjects/biology" className="dashboard-card">
          <span className="card-label">Subject</span>
          <h2>Biology</h2>
          <p>Anatomy, systems, plants, and living organisms.</p>
        </Link>
      </section>
    </div>
  );
}
