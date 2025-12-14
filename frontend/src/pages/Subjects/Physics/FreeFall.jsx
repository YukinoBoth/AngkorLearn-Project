import { useState } from "react";

export default function FreeFall() {
  const [height, setHeight] = useState(10);
  const gravity = 9.8;

  const time = Math.sqrt((2 * height) / gravity).toFixed(2);
  const velocity = (gravity * time).toFixed(2);

  return (
    <div className="physics-card slide-up">
      <h2>Free Fall Simulator</h2>
      <p className="description">
        Calculate how long an object takes to fall and its velocity on impact.
      </p>

      <label>
        Height (meters)
        <input
          type="number"
          min="1"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </label>

      <div className="results">
        <div>
          <span>Time to fall</span>
          <strong>{time} s</strong>
        </div>
        <div>
          <span>Impact velocity</span>
          <strong>{velocity} m/s</strong>
        </div>
      </div>
    </div>
  );
}
