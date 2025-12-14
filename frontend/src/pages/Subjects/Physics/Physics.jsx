import "./physics.css";
import FreeFall from "./FreeFall";
import Momentum from "./Momentum";

export default function Physics() {
  return (
    <div className="physics-page fade-in">
      <header className="physics-header">
        <h1>Physics Playground</h1>
        <p>
          Explore fundamental physics concepts through interactive simulations.
        </p>
      </header>

      <section className="physics-section">
        <FreeFall />
        <Momentum />
      </section>
    </div>
  );
}
