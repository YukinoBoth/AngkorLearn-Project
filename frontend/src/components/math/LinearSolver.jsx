// src/components/math/LinearSolver.jsx
import React, { useRef, useState, useEffect } from "react";

/*
Supports single-variable linear equations in x.
Examples accepted:
  2x + 5 = 17
  x - 3 = 2
  -3x + 4 = 10
  2*x + 5 = 17
*/
function parseSide(side) {
  // normalize: remove spaces, replace unary minus carefully
  let s = side.replace(/\s+/g, "");
  // insert + before leading - for split convenience
  if (s[0] !== "-") s = "+" + s;
  const parts = s.match(/[+\-][^+\-]*/g) || [];
  let coeff = 0;
  let constant = 0;
  parts.forEach((p) => {
    if (p.includes("x")) {
      let t = p.replace("*", "").replace("x", "");
      if (t === "+" || t === "") t = "+1";
      if (t === "-") t = "-1";
      coeff += parseFloat(t);
    } else {
      constant += parseFloat(p);
    }
  });
  return { coeff, constant };
}

export default function LinearSolver() {
  const [input, setInput] = useState("2x + 5 = 17");
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const solve = () => {
    setError("");
    setSolution(null);
    try {
      if (!input.includes("=")) throw new Error("Equation must include '='");
      const [L, R] = input.split("=");
      const left = parseSide(L);
      const right = parseSide(R);
      // bring to form ax = b
      const a = left.coeff - right.coeff;
      const b = right.constant - left.constant;
      if (Math.abs(a) < 1e-9) {
        if (Math.abs(b) < 1e-9) setSolution({ type: "infinite" });
        else setSolution({ type: "none" });
      } else {
        const x = b / a;
        setSolution({ type: "one", x, a, b });
      }
    } catch (e) {
      setError(e.message || "Parse error");
    }
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, [solution]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // axes
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 30) {
      ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += 30) {
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    }
    // main axes
    ctx.strokeStyle = "#1E40AF"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke();

    // draw LHS and RHS lines: treat as functions y = LHS(x) and y = RHS(x)
    // We'll draw y = leftCoeff*x + leftConst and right similarly
    try {
      const [L, R] = input.split("=");
      const left = parseSide(L), right = parseSide(R);
      const scale = 30;
      const toPx = (x, y) => [W/2 + x*scale, H/2 - y*scale];

      // draw left in blue
      ctx.strokeStyle = "#3B82F6"; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let px = 0; px <= W; px++) {
        const x = (px - W/2)/scale;
        const y = left.coeff * x + left.constant;
        const [sx, sy] = toPx(x, y);
        if (px === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // draw right in orange
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let px = 0; px <= W; px++) {
        const x = (px - W/2)/scale;
        const y = right.coeff * x + right.constant;
        const [sx, sy] = toPx(x, y);
        if (px === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // if solution one, mark intersection
      if (solution && solution.type === "one") {
        const x = solution.x;
        const y = left.coeff * x + left.constant;
        const [sx, sy] = [W/2 + x*30, H/2 - y*30];
        ctx.fillStyle = "#ef4444";
        ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI*2); ctx.fill();
      }
    } catch (e) {
      // ignore drawing errors
    }
  };

  return (
    <div>
      <h3>Linear Equation Solver & Visualizer</h3>
      <p>Enter a linear equation in <code>x</code> (examples: <code>2x + 5 = 17</code>, <code>x - 3 = 2</code>)</p>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <input style={{ flex: 1 }} value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="btn" onClick={solve}>Solve</button>
      </div>
      {error && <div className="err">{error}</div>}
      {solution && solution.type === "one" && (
        <div style={{ marginBottom: 8 }}>
          <strong>Solution:</strong> x = {Number(solution.x.toFixed(6))}
        </div>
      )}
      {solution && solution.type === "infinite" && <div>Infinite solutions (identity)</div>}
      {solution && solution.type === "none" && <div>No solution</div>}

      <canvas ref={canvasRef} width={900} height={900} style={{ borderRadius: 10, background: "white" }} />
      <div style={{ color: "var(--muted)", marginTop: 8 }}>
        Blue = LHS, Orange = RHS. Intersection point (if any) marked in red.
      </div>
    </div>
  );
}
