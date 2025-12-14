// src/components/math/GeometryPlayground.jsx
import React, { useEffect, useRef, useState } from "react";

/* ---------- Utility math helpers ---------- */

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const polygonPerimeter = (pts) => {
  if (!pts || pts.length < 2) return 0;
  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    sum += distance(a, b);
  }
  return sum;
};

const polygonArea = (pts) => {
  // Shoelace formula
  if (!pts || pts.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum / 2);
};

const centroid = (pts) => {
  if (!pts || pts.length === 0) return null;
  let cx = 0,
    cy = 0;
  if (pts.length === 1) return { ...pts[0] };
  if (pts.length === 2) return { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
  // polygon centroid
  let A = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const cross = a.x * b.y - b.x * a.y;
    A += cross;
    cx += (a.x + b.x) * cross;
    cy += (a.y + b.y) * cross;
  }
  A *= 0.5;
  if (Math.abs(A) < 1e-9) return { x: pts[0].x, y: pts[0].y };
  cx /= 6 * A;
  cy /= 6 * A;
  return { x: cx, y: cy };
};

const angleBetween = (pA, pB, pC) => {
  // angle at pB, between BA and BC, returns degrees
  const v1 = { x: pA.x - pB.x, y: pA.y - pB.y };
  const v2 = { x: pC.x - pB.x, y: pC.y - pB.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.hypot(v1.x, v1.y) || 1e-9;
  const mag2 = Math.hypot(v2.x, v2.y) || 1e-9;
  let cos = dot / (mag1 * mag2);
  cos = Math.max(-1, Math.min(1, cos));
  return (Math.acos(cos) * 180) / Math.PI;
};

/* ---------- Component ---------- */

export default function GeometryPlayground() {
  const svgRef = useRef(null);

  // canvas size
  const width = 820;
  const height = 420;
  const gridSize = 20;

  // shape mode: rect | circle | triangle | polygon
  const [mode, setMode] = useState("rect");

  // flags
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [fillOpacity, setFillOpacity] = useState(0.6);

  // Generic dragging state
  const [dragging, setDragging] = useState(null); // { type: "rect"|"circle"|"poly", idx }
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // rectangle & circle state
  const [rect, setRect] = useState({ x: 100, y: 90, w: 240, h: 140 });
  const [circle, setCircle] = useState({ cx: 360, cy: 200, r: 70 });

  // triangle: stored as array of 3 points
  const [trianglePts, setTrianglePts] = useState([
    { x: 160, y: 120 },
    { x: 320, y: 110 },
    { x: 240, y: 260 },
  ]);

  // polygon: dynamic points
  const [polyPts, setPolyPts] = useState([
    { x: 480, y: 110 },
    { x: 620, y: 140 },
    { x: 640, y: 260 },
    { x: 520, y: 300 },
  ]);
  const [polyClosed, setPolyClosed] = useState(true);

  // selected point info for numeric editing
  const [selected, setSelected] = useState(null); // { type: "rect"|"circle"|"tri"|"poly", idx }

  // ----------------------- helpers -----------------------
  const snap = (v) => (snapToGrid ? Math.round(v / gridSize) * gridSize : v);

  const toSVGPoint = (clientX, clientY) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };

  // ----------------------- dragging logic -----------------------
  const onMouseDown = (e) => {
    const p = toSVGPoint(e.clientX, e.clientY);

    if (mode === "rect") {
      if (p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h) {
        setDragging({ type: "rect" });
        setOffset({ x: p.x - rect.x, y: p.y - rect.y });
        setSelected({ type: "rect" });
      } else setSelected(null);
    } else if (mode === "circle") {
      const dx = p.x - circle.cx,
        dy = p.y - circle.cy;
      if (Math.hypot(dx, dy) <= circle.r) {
        setDragging({ type: "circle" });
        setOffset({ x: dx, y: dy });
        setSelected({ type: "circle" });
      } else setSelected(null);
    } else if (mode === "triangle") {
      // check each vertex
      let hit = false;
      trianglePts.forEach((pt, i) => {
        if (distance(pt, p) < 12) {
          setDragging({ type: "tri", idx: i });
          setOffset({ x: p.x - pt.x, y: p.y - pt.y });
          setSelected({ type: "tri", idx: i });
          hit = true;
        }
      });
      if (!hit) {
        // check inside triangle: if clicked inside polygon, select none
        setSelected(null);
      }
    } else if (mode === "polygon") {
      // check each vertex first
      let hit = false;
      polyPts.forEach((pt, i) => {
        if (distance(pt, p) < 12) {
          setDragging({ type: "poly", idx: i });
          setOffset({ x: p.x - pt.x, y: p.y - pt.y });
          setSelected({ type: "poly", idx: i });
          hit = true;
        }
      });
      if (!hit) {
        // If polygon is not closed, adding a point mode: click adds
        if (!polyClosed) {
          const newPts = [...polyPts, { x: snap(p.x), y: snap(p.y) }];
          setPolyPts(newPts);
        } else {
          setSelected(null);
        }
      }
    }
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    const p = toSVGPoint(e.clientX, e.clientY);

    if (dragging.type === "rect") {
      const nx = snap(p.x - offset.x);
      const ny = snap(p.y - offset.y);
      setRect((r) => ({ ...r, x: Math.max(0, Math.min(width - r.w, nx)), y: Math.max(0, Math.min(height - r.h, ny)) }));
    } else if (dragging.type === "circle") {
      const nx = snap(p.x - offset.x);
      const ny = snap(p.y - offset.y);
      setCircle((c) => ({ ...c, cx: Math.max(0, Math.min(width, nx)), cy: Math.max(0, Math.min(height, ny)) }));
    } else if (dragging.type === "tri") {
      const idx = dragging.idx;
      const nx = snap(p.x - offset.x);
      const ny = snap(p.y - offset.y);
      setTrianglePts((t) => t.map((pt, i) => (i === idx ? { x: Math.max(0, Math.min(width, nx)), y: Math.max(0, Math.min(height, ny)) } : pt)));
    } else if (dragging.type === "poly") {
      const idx = dragging.idx;
      const nx = snap(p.x - offset.x);
      const ny = snap(p.y - offset.y);
      setPolyPts((t) => t.map((pt, i) => (i === idx ? { x: Math.max(0, Math.min(width, nx)), y: Math.max(0, Math.min(height, ny)) } : pt)));
    }
  };

  const onMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    // eslint-disable-next-line
  }, [dragging, offset, snapToGrid, polyPts, trianglePts]);

  // ----------------------- polygon helpers -----------------------
  const addPolyPoint = () => {
    const defaultPt = { x: Math.round(width / 2), y: Math.round(height / 2) };
    setPolyPts((p) => [...p, defaultPt]);
    setPolyClosed(false);
  };

  const deleteLastPolyPoint = () => {
    setPolyPts((p) => (p.length > 0 ? p.slice(0, -1) : p));
  };

  const resetPolygon = () => {
    setPolyPts([]);
    setPolyClosed(false);
  };

  const toggleClosePoly = () => {
    if (polyPts.length < 3) return alert("Need at least 3 points to close polygon");
    setPolyClosed((v) => !v);
  };

  // ----------------------- triangle helpers -----------------------
  const addTrianglePoint = () => {
    // not needed: triangle must have 3 points; reset to default if missing
    setTrianglePts([{ x: 160, y: 120 }, { x: 320, y: 110 }, { x: 240, y: 260 }]);
  };

  // ----------------------- numeric input editing -----------------------
  const updateSelectedCoord = (axis, value) => {
    const val = Number(value);
    if (selected?.type === "rect") {
      if (axis === "x") setRect((r) => ({ ...r, x: val }));
      if (axis === "y") setRect((r) => ({ ...r, y: val }));
      if (axis === "w") setRect((r) => ({ ...r, w: Math.max(1, val) }));
      if (axis === "h") setRect((r) => ({ ...r, h: Math.max(1, val) }));
    } else if (selected?.type === "circle") {
      if (axis === "cx") setCircle((c) => ({ ...c, cx: val }));
      if (axis === "cy") setCircle((c) => ({ ...c, cy: val }));
      if (axis === "r") setCircle((c) => ({ ...c, r: Math.max(1, val) }));
    } else if (selected?.type === "tri") {
      const idx = selected.idx;
      setTrianglePts((t) => t.map((pt, i) => (i === idx ? { ...pt, [axis]: val } : pt)));
    } else if (selected?.type === "poly") {
      const idx = selected.idx;
      setPolyPts((t) => t.map((pt, i) => (i === idx ? { ...pt, [axis]: val } : pt)));
    }
  };

  // ----------------------- computed displays -----------------------
  const rectProps = {
    area: rect.w * rect.h,
    per: 2 * (rect.w + rect.h),
    mid: { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 },
    centroid: { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 },
  };

  const circleProps = {
    area: Math.PI * circle.r * circle.r,
    per: 2 * Math.PI * circle.r,
    centroid: { x: circle.cx, y: circle.cy },
  };

  const triArea = polygonArea(trianglePts);
  const triPer = polygonPerimeter(trianglePts);
  const triCent = centroid(trianglePts);
  const triAngles = trianglePts.length === 3 ? [
    angleBetween(trianglePts[1], trianglePts[0], trianglePts[2]),
    angleBetween(trianglePts[0], trianglePts[1], trianglePts[2]),
    angleBetween(trianglePts[0], trianglePts[2], trianglePts[1]),
  ] : [];

  const polyArea = polygonArea(polyPts);
  const polyPer = polygonPerimeter(polyPts);
  const polyCent = centroid(polyPts);
  const polyAngles = polyPts.length >= 3 ? polyPts.map((p, i) => {
    const prev = polyPts[(i - 1 + polyPts.length) % polyPts.length];
    const next = polyPts[(i + 1) % polyPts.length];
    return angleBetween(prev, p, next);
  }) : [];

  // ----------------------- helpers to render labels -----------------------
  const renderPointLabel = (pt, label, offsetX = 8, offsetY = -8, color = "#1E40AF") => (
    <text x={pt.x + offsetX} y={pt.y + offsetY} fontSize="12" fill={color} textAnchor="start">
      {label}
    </text>
  );

  // ----------------------- UI -----------------------
  return (
    <div>
      <h3>Geometry Playground (Advanced)</h3>
      <p>Triangle & Polygon creator with angles, centroid, midpoints, snap-to-grid and numeric editing.</p>

      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => setMode("rect")} style={{ background: mode === "rect" ? "var(--primary)" : undefined }}>Rectangle</button>
          <button className="btn" onClick={() => setMode("circle")} style={{ background: mode === "circle" ? "var(--primary)" : undefined }}>Circle</button>
          <button className="btn" onClick={() => setMode("triangle")} style={{ background: mode === "triangle" ? "var(--primary)" : undefined }}>Triangle</button>
          <button className="btn" onClick={() => setMode("polygon")} style={{ background: mode === "polygon" ? "var(--primary)" : undefined }}>Polygon</button>
        </div>

        <div style={{ marginLeft: 12, display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} /> Grid
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="checkbox" checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} /> Snap to grid
          </label>

          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            Fill opacity
            <input type="range" min={0} max={1} step={0.05} value={fillOpacity} onChange={(e) => setFillOpacity(Number(e.target.value))} />
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16 }}>

        {/* LEFT: SVG canvas */}
        <div>
          <svg
            ref={svgRef}
            width={width}
            height={height}
            style={{ background: "white", borderRadius: 12, boxShadow: "var(--shadow)", cursor: "crosshair" }}
            onMouseDown={onMouseDown}
            onDoubleClick={(e) => {
              // double click in polygon mode toggles close if >2 points
              if (mode === "polygon" && polyPts.length >= 3) setPolyClosed(true);
            }}
          >
            {/* grid */}
            {showGrid && (
              <g>
                {Array.from({ length: Math.ceil(width / gridSize) + 1 }).map((_, i) => (
                  <line key={"v" + i} x1={i * gridSize} y1={0} x2={i * gridSize} y2={height} stroke="#f3f4f6" strokeWidth={1} />
                ))}
                {Array.from({ length: Math.ceil(height / gridSize) + 1 }).map((_, i) => (
                  <line key={"h" + i} x1={0} y1={i * gridSize} x2={width} y2={i * gridSize} stroke="#f3f4f6" strokeWidth={1} />
                ))}
              </g>
            )}

            {/* Rectangle */}
            {mode === "rect" && (
              <>
                <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} fill="rgba(59,130,246,0.08)" stroke="#1E40AF" strokeWidth={2} rx={8} />
                {/* centroid */}
                <circle cx={rectProps.centroid.x} cy={rectProps.centroid.y} r={4} fill="#ef4444" />
                {renderPointLabel(rectProps.centroid, `centroid (${Math.round(rectProps.centroid.x)}, ${Math.round(rectProps.centroid.y)})`, 10, -10)}
              </>
            )}

            {/* Circle */}
            {mode === "circle" && (
              <>
                <circle cx={circle.cx} cy={circle.cy} r={circle.r} fill={`rgba(16,185,129,${fillOpacity})`} stroke="#059669" strokeWidth={2} />
                <circle cx={circle.cx} cy={circle.cy} r={3} fill="#ef4444" />
                {renderPointLabel(circleProps.centroid, `(${Math.round(circleProps.centroid.x)}, ${Math.round(circleProps.centroid.y)})`, 10, -10, "#059669")}
              </>
            )}

            {/* Triangle */}
            {mode === "triangle" && (
              <>
                <polygon points={trianglePts.map((p) => `${p.x},${p.y}`).join(" ")} fill={`rgba(59,130,246,${fillOpacity})`} stroke="#1E40AF" strokeWidth={2} />
                {/* vertices */}
                {trianglePts.map((p, i) => (
                  <g key={"tpt" + i}>
                    <circle cx={p.x} cy={p.y} r={7} fill={selected?.type === "tri" && selected.idx === i ? "#f97316" : "#3B82F6"} stroke="#fff" strokeWidth={1} />
                    {renderPointLabel(p, `P${i + 1}`, 8, -8)}
                    <text x={p.x} y={p.y + 20} fontSize="12" fill="#111827" textAnchor="middle">
                      {distance(trianglePts[i], trianglePts[(i + 1) % 3]).toFixed(1)}
                    </text>
                  </g>
                ))}

                {/* centroid */}
                {triCent && <g>
                  <circle cx={triCent.x} cy={triCent.y} r={4} fill="#10B981" />
                  {renderPointLabel(triCent, `centroid`, 8, -8, "#10B981")}
                </g>}

                {/* interior angles */}
                {trianglePts.map((p, i) => (
                  <text key={"ang" + i} x={p.x - 10} y={p.y - 20} fontSize="12" fill="#f59e0b">{triAngles[i]?.toFixed(1)}°</text>
                ))}
              </>
            )}

            {/* Polygon */}
            {mode === "polygon" && (
              <>
                {polyPts.length >= 3 && (
                  <polygon points={polyPts.map((p) => `${p.x},${p.y}`).join(" ")} fill={`rgba(139,92,246,${fillOpacity})`} stroke="#6D28D9" strokeWidth={2} opacity={polyClosed ? 1 : 0.6} />
                )}

                {/* edges lengths */}
                {polyPts.map((p, i) => {
                  const nxt = polyPts[(i + 1) % polyPts.length];
                  const mid = { x: (p.x + (nxt ? nxt.x : p.x)) / 2, y: (p.y + (nxt ? nxt.y : p.y)) / 2 };
                  return polyPts.length >= 2 ? (
                    <g key={"edge" + i}>
                      <text x={mid.x} y={mid.y} fontSize="11" fill="#374151" textAnchor="middle">{(distance(p, nxt) || 0).toFixed(1)}</text>
                    </g>
                  ) : null;
                })}

                {/* vertices */}
                {polyPts.map((p, i) => (
                  <g key={"pp" + i}>
                    <circle cx={p.x} cy={p.y} r={7} fill={selected?.type === "poly" && selected.idx === i ? "#f97316" : "#8b5cf6"} stroke="#fff" strokeWidth={1} />
                    {renderPointLabel(p, `P${i}`, 8, -8, "#6D28D9")}
                    {/* angle */}
                    {polyAngles[i] !== undefined && <text x={p.x - 18} y={p.y - 18} fontSize="11" fill="#f59e0b">{polyAngles[i].toFixed(1)}°</text>}
                  </g>
                ))}

                {/* centroid */}
                {polyCent && <g>
                  <circle cx={polyCent.x} cy={polyCent.y} r={4} fill="#10B981" />
                  {renderPointLabel(polyCent, `centroid`, 8, -8, "#10B981")}
                </g>}
              </>
            )}
          </svg>

        </div>

        {/* RIGHT: Control Panel */}
        <div style={{ width: 320 }}>
          <div style={{ padding: 12, background: "#fff", borderRadius: 12, boxShadow: "var(--shadow)" }}>
            <h4>Controls</h4>

            {/* Selected editing */}
            <div style={{ marginBottom: 10 }}>
              <strong>Selected</strong>: {selected ? `${selected.type}${selected.idx !== undefined ? " #" + selected.idx : ""}` : "none"}
            </div>

            {/* Numeric editor for selected */}
            {selected && selected.type === "rect" && (
              <>
                <label>X</label>
                <input type="number" value={Math.round(rect.x)} onChange={(e) => updateSelectedCoord("x", e.target.value)} />
                <label>Y</label>
                <input type="number" value={Math.round(rect.y)} onChange={(e) => updateSelectedCoord("y", e.target.value)} />
                <label>Width</label>
                <input type="number" value={Math.round(rect.w)} onChange={(e) => updateSelectedCoord("w", e.target.value)} />
                <label>Height</label>
                <input type="number" value={Math.round(rect.h)} onChange={(e) => updateSelectedCoord("h", e.target.value)} />
              </>
            )}

            {selected && selected.type === "circle" && (
              <>
                <label>CX</label>
                <input type="number" value={Math.round(circle.cx)} onChange={(e) => updateSelectedCoord("cx", e.target.value)} />
                <label>CY</label>
                <input type="number" value={Math.round(circle.cy)} onChange={(e) => updateSelectedCoord("cy", e.target.value)} />
                <label>Radius</label>
                <input type="number" value={Math.round(circle.r)} onChange={(e) => updateSelectedCoord("r", e.target.value)} />
              </>
            )}

            {selected && selected.type === "tri" && (
              <>
                <div><strong>Vertex {selected.idx}</strong></div>
                <label>X</label>
                <input type="number" value={Math.round(trianglePts[selected.idx].x)} onChange={(e) => updateSelectedCoord("x", e.target.value)} />
                <label>Y</label>
                <input type="number" value={Math.round(trianglePts[selected.idx].y)} onChange={(e) => updateSelectedCoord("y", e.target.value)} />
              </>
            )}

            {selected && selected.type === "poly" && (
              <>
                <div><strong>Vertex {selected.idx}</strong></div>
                <label>X</label>
                <input type="number" value={Math.round(polyPts[selected.idx].x)} onChange={(e) => updateSelectedCoord("x", e.target.value)} />
                <label>Y</label>
                <input type="number" value={Math.round(polyPts[selected.idx].y)} onChange={(e) => updateSelectedCoord("y", e.target.value)} />
              </>
            )}

            <hr />

            {/* Polygon tools */}
            {mode === "polygon" && (
              <>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <button className="btn" onClick={addPolyPoint}>Add point</button>
                  <button className="btn" onClick={deleteLastPolyPoint}>Delete last</button>
                  <button className="btn" onClick={resetPolygon}>Reset</button>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <button className="btn" onClick={toggleClosePoly}>{polyClosed ? "Open polygon" : "Close polygon"}</button>
                </div>
              </>
            )}

            {/* Triangle tools */}
            {mode === "triangle" && (
              <>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <button className="btn" onClick={() => setTrianglePts([{ x: 160, y: 120 }, { x: 320, y: 110 }, { x: 240, y: 260 }])}>Reset triangle</button>
                </div>
              </>
            )}

            <hr />

            {/* Measurements display */}
            <div>
              <h5>Measurements</h5>

              {mode === "rect" && (
                <>
                  <div>Area: <b>{rectProps.area.toFixed(1)}</b></div>
                  <div>Perimeter: <b>{rectProps.per.toFixed(1)}</b></div>
                </>
              )}

              {mode === "circle" && (
                <>
                  <div>Area: <b>{circleProps.area.toFixed(1)}</b></div>
                  <div>Circumference: <b>{circleProps.per.toFixed(1)}</b></div>
                </>
              )}

              {mode === "triangle" && (
                <>
                  <div>Area: <b>{triArea.toFixed(2)}</b></div>
                  <div>Perimeter: <b>{triPer.toFixed(2)}</b></div>
                  <div>Angles: {triAngles.map((a, i) => <span key={i}> P{i+1}:{a.toFixed(1)}° </span>)}</div>
                </>
              )}

              {mode === "polygon" && (
                <>
                  <div>Area: <b>{polyArea.toFixed(2)}</b></div>
                  <div>Perimeter: <b>{polyPer.toFixed(2)}</b></div>
                  <div>Vertices: <b>{polyPts.length}</b></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
