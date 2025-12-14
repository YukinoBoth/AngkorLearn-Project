// src/components/math/FunctionGrapher.jsx
import React, { useRef, useEffect, useState } from "react";

export default function FunctionGrapher() {
  const canvasRef = useRef(null);
  const [expr, setExpr] = useState("x*x"); // Default: x²
  const [error, setError] = useState("");

    const width = 900;
    const height = 400;

  const scale = 30; // pixels per unit

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, width, height);

    // Draw gridlines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#1E40AF";
    ctx.lineWidth = 2;

    // x-axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // y-axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Draw function curve
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 2;

    let f;
    try {
      // Turn user expression into a JavaScript function: f(x)
      f = new Function("x", `return ${expr}`);
      setError("");
    } catch {
      setError("Invalid function expression.");
      return;
    }

    ctx.beginPath();
    for (let px = 0; px < width; px++) {
      const x = (px - width / 2) / scale;

      let y;
      try {
        y = f(x);
      } catch {
        setError("Math error while evaluating function.");
        break;
      }

      const py = height / 2 - y * scale;

      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  };

  useEffect(() => {
    draw();
  }, [expr]);

  return (
    <div className="module">
      <h3>Function Grapher</h3>
      <p>Enter a function in terms of <b>x</b> (examples: <code>x*x</code>, <code>Math.sin(x)</code>, <code>Math.sqrt(x)</code>)</p>

      <input
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        className="graph-input"
        placeholder="Enter a function, e.g. x*x"
      />

      {error && <div className="err">{error}</div>}

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ borderRadius: "12px", background: "white" }}
        ></canvas>
      </div>
    </div>
  );
}
