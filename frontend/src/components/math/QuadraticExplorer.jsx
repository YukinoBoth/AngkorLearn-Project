// src/components/math/QuadraticExplorer.jsx
import React, { useEffect, useRef, useState } from "react";

function computeRoots(a,b,c) {
  const disc = b*b - 4*a*c;
  if (disc < 0) return { disc, roots: [] };
  if (Math.abs(disc) < 1e-9) return { disc, roots: [ -b/(2*a) ] };
  return { disc, roots: [ (-b + Math.sqrt(disc))/(2*a), (-b - Math.sqrt(disc))/(2*a) ] };
}

export default function QuadraticExplorer() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-3);
  const [c, setC] = useState(2);
  const canvasRef = useRef(null);

  useEffect(() => draw(), [a,b,c]);

  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);

    // grid
    ctx.strokeStyle = "#eef2ff"; ctx.lineWidth = 1;
    const scale = 30;
    for (let x=0;x<=W;x+=scale){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for (let y=0;y<=H;y+=scale){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

    ctx.strokeStyle = "#1E40AF"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke();

    // draw parabola
    ctx.strokeStyle = "#3B82F6"; ctx.lineWidth = 2;
    const toPx = (x,y) => [W/2 + x*scale, H/2 - y*scale];
    ctx.beginPath();
    for (let px = 0; px <= W; px++) {
      const x = (px - W/2) / scale;
      const y = a*x*x + b*x + c;
      const [sx, sy] = toPx(x, y);
      if (px === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // vertex
    const xv = -b/(2*a);
    const yv = a*xv*xv + b*xv + c;
    const [vx, vy] = toPx(xv, yv);
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(vx, vy, 5, 0, Math.PI*2); ctx.fill();

    // roots
    const { disc, roots } = computeRoots(a,b,c);
    ctx.fillStyle = "#10B981";
    roots.forEach((r) => {
      const [rx, ry] = toPx(r, 0);
      ctx.beginPath(); ctx.arc(rx, ry, 4, 0, Math.PI*2); ctx.fill();
    });
  };

  const discObj = computeRoots(a,b,c);
  const vertex = { x: -b/(2*a), y: a*(-b/(2*a))*(-b/(2*a)) + b*(-b/(2*a)) + c };

  return (
    <div>
      <h3>Quadratic Explorer</h3>
      <p>Adjust a, b, c to see the parabola update live.</p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <label style={{ minWidth: 20 }}>a</label>
        <input type="range" min={-5} max={5} step={0.1} value={a} onChange={(e)=>setA(Number(e.target.value))} />
        <div style={{ width: 60, textAlign: "right" }}>{a}</div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <label style={{ minWidth: 20 }}>b</label>
        <input type="range" min={-10} max={10} step={0.1} value={b} onChange={(e)=>setB(Number(e.target.value))} />
        <div style={{ width: 60, textAlign: "right" }}>{b}</div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <label style={{ minWidth: 20 }}>c</label>
        <input type="range" min={-10} max={10} step={0.1} value={c} onChange={(e)=>setC(Number(e.target.value))} />
        <div style={{ width: 60, textAlign: "right" }}>{c}</div>
      </div>

      <canvas ref={canvasRef} width={900} height={500} style={{ borderRadius: 10, background: "white" }} />

      <div style={{ marginTop: 10, color: "var(--muted)" }}>
        <div>Vertex: ( {vertex.x.toFixed(3)} , {vertex.y.toFixed(3)} )</div>
        <div>Discriminant: {discObj.disc.toFixed(3)} — Roots: {discObj.roots.length ? discObj.roots.map(r=>r.toFixed(3)).join(", ") : "none (complex)"}</div>
      </div>
    </div>
  );
}
