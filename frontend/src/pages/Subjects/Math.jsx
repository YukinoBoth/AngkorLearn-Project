// src/pages/Subjects/Math.jsx
import React from "react";
import FunctionGrapher from "../../components/math/FunctionGrapher";
import Collapsible from "../../components/math/Collapsible";
import LinearSolver from "../../components/math/LinearSolver";
import QuadraticExplorer from "../../components/math/QuadraticExplorer";
import GeometryPlayground from "../../components/math/GeometryPlayground";

export default function Math() {
  return (
    <div className="page">
      <h1>Math Playground</h1>
      <p>Experiment with functions, equations, quadratics and geometry.</p>

      <Collapsible title="Function Grapher" defaultOpen={true}>
        <FunctionGrapher />
      </Collapsible>

      <Collapsible title="Linear Equation Solver & Visualizer">
        <LinearSolver />
      </Collapsible>

      <Collapsible title="Quadratic Explorer">
        <QuadraticExplorer />
      </Collapsible>

      <Collapsible title="Geometry Playground">
        <GeometryPlayground />
      </Collapsible>
    </div>
  );
}
