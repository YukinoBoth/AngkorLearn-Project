import { useState } from "react";

export default function Momentum() {
  const [mass, setMass] = useState(2);
  const [velocity, setVelocity] = useState(3);

  const momentum = (mass * velocity).toFixed(2);

  return (
    <div className="physics-card slide-up delay">
      <h2>Momentum Calculator</h2>
      <p className="description">
        Understand momentum by adjusting mass and velocity.
      </p>

      <label>
        Mass (kg)
        <input
          type="number"
          min="0.1"
          value={mass}
          onChange={(e) => setMass(e.target.value)}
        />
      </label>

      <label>
        Velocity (m/s)
        <input
          type="number"
          value={velocity}
          onChange={(e) => setVelocity(e.target.value)}
        />
      </label>

      <div className="results">
        <div>
          <span>Momentum</span>
          <strong>{momentum} kg·m/s</strong>
        </div>
      </div>
    </div>
  );
}
