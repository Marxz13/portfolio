"use client";

import { useEffect, useState } from "react";
import type { ArchSpec, ArchNode, ArchEdge } from "../data/portfolio";

/* On-brand architecture / communication diagram. Pure SVG with a fixed viewBox
   (deterministic - no DOM measuring), scaled responsively via width:100%. Nodes
   carry explicit coords; edges are routed with simple direction-aware beziers and
   labelled. Edge "kind" drives colour + dash; a subtle pulse travels FE<->BE edges
   to show live communication (skipped under prefers-reduced-motion). */

const COLORS: Record<NonNullable<ArchEdge["kind"]>, { stroke: string; marker: string; dash?: string }> = {
  rest: { stroke: "var(--ink)", marker: "arrow-ink" },
  auth: { stroke: "var(--accent)", marker: "arrow-accent" },
  realtime: { stroke: "var(--accent)", marker: "arrow-accent", dash: "5 4" },
  bridge: { stroke: "var(--accent)", marker: "arrow-accent" },
  data: { stroke: "var(--muted)", marker: "arrow-muted" },
  ext: { stroke: "var(--muted)", marker: "arrow-muted", dash: "4 4" },
};

// edges that tell the FE<->BE story get an animated pulse; plumbing edges don't
const PULSE_KINDS = new Set(["rest", "auth", "realtime", "bridge"]);

// legend rows, rendered only for the edge kinds a given diagram actually uses
const LEGEND: { kind: NonNullable<ArchEdge["kind"]>; label: string; cls: string }[] = [
  { kind: "rest", label: "REST / IPC", cls: "arch-leg-ink" },
  { kind: "auth", label: "Auth", cls: "arch-leg-accent" },
  { kind: "bridge", label: "Bridge", cls: "arch-leg-accent" },
  { kind: "realtime", label: "Realtime", cls: "arch-leg-accent arch-leg-dash" },
  { kind: "data", label: "Data", cls: "arch-leg-muted" },
  { kind: "ext", label: "External", cls: "arch-leg-muted arch-leg-dash" },
];

type Pt = { x: number; y: number };

const center = (n: ArchNode): Pt => ({ x: n.x + n.w / 2, y: n.y + n.h / 2 });

function anchors(a: ArchNode, b: ArchNode, offset: number) {
  const ac = center(a);
  const bc = center(b);
  let s: Pt, e: Pt, horiz: boolean;
  if (b.x >= a.x + a.w) {
    s = { x: a.x + a.w, y: ac.y + offset };
    e = { x: b.x, y: bc.y + offset };
    horiz = true;
  } else if (b.x + b.w <= a.x) {
    s = { x: a.x, y: ac.y + offset };
    e = { x: b.x + b.w, y: bc.y + offset };
    horiz = true;
  } else if (b.y >= a.y + a.h) {
    s = { x: ac.x + offset, y: a.y + a.h };
    e = { x: bc.x + offset, y: b.y };
    horiz = false;
  } else if (b.y + b.h <= a.y) {
    s = { x: ac.x + offset, y: a.y };
    e = { x: bc.x + offset, y: b.y + b.h };
    horiz = false;
  } else {
    s = { x: a.x + a.w, y: ac.y };
    e = { x: b.x, y: bc.y };
    horiz = true;
  }
  return { s, e, horiz };
}

function pathD(s: Pt, e: Pt, horiz: boolean) {
  if (horiz) {
    const dx = (e.x >= s.x ? 1 : -1) * Math.max(40, Math.abs(e.x - s.x) * 0.5);
    return `M${s.x},${s.y} C${s.x + dx},${s.y} ${e.x - dx},${e.y} ${e.x},${e.y}`;
  }
  const dy = (e.y >= s.y ? 1 : -1) * Math.max(30, Math.abs(e.y - s.y) * 0.5);
  return `M${s.x},${s.y} C${s.x},${s.y + dy} ${e.x},${e.y - dy} ${e.x},${e.y}`;
}

export default function ArchitectureDiagram({ spec }: { spec: ArchSpec }) {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const byId = new Map(spec.nodes.map((n) => [n.id, n]));
  const usedKinds = new Set(spec.edges.map((e) => e.kind || "rest"));
  const pad = 12;
  const vbW = Math.max(...spec.nodes.map((n) => n.x + n.w)) + pad;
  const vbH = Math.max(...spec.nodes.map((n) => n.y + n.h)) + pad;

  return (
    <div className="arch-wrap">
      <svg
        className="arch-svg"
        viewBox={`0 0 ${vbW} ${vbH}`}
        role="img"
        aria-label={spec.aria || "Architecture diagram"}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {[
            ["arrow-ink", "var(--ink)"],
            ["arrow-accent", "var(--accent)"],
            ["arrow-muted", "var(--muted)"],
          ].map(([id, fill]) => (
            <marker
              key={id}
              id={id}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" style={{ fill }} />
            </marker>
          ))}
        </defs>

        {/* edges (drawn first so node boxes sit on top of the line ends) */}
        {spec.edges.map((edge, i) => {
          const a = byId.get(edge.from);
          const b = byId.get(edge.to);
          if (!a || !b) return null;
          const kind = edge.kind || "rest";
          const c = COLORS[kind];
          const { s, e, horiz } = anchors(a, b, edge.offset || 0);
          const d = pathD(s, e, horiz);
          const lx = horiz ? (s.x + e.x) / 2 : (s.x + e.x) / 2 + 6;
          const ly = horiz ? (s.y + e.y) / 2 - 5 : (s.y + e.y) / 2;
          const labelW = edge.label ? edge.label.length * 5.4 + 8 : 0;
          return (
            <g key={i}>
              <path
                d={d}
                fill="none"
                style={{ stroke: c.stroke }}
                strokeWidth={kind === "bridge" ? 2 : 1.5}
                strokeDasharray={c.dash}
                markerEnd={`url(#${c.marker})`}
                markerStart={edge.bidir ? `url(#${c.marker})` : undefined}
              />
              {!reduce && PULSE_KINDS.has(kind) && (
                <circle r="2.6" opacity="0.9" style={{ fill: c.stroke }}>
                  <animateMotion dur="2.4s" repeatCount="indefinite" path={d} />
                </circle>
              )}
              {edge.label && (
                <g>
                  <rect
                    x={lx - labelW / 2}
                    y={ly - 7}
                    width={labelW}
                    height={13}
                    rx={2}
                    className="arch-edge-label-bg"
                  />
                  <text x={lx} y={ly + 2.5} className="arch-edge-label" textAnchor="middle">
                    {edge.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* nodes */}
        {spec.nodes.map((n) => (
          <g key={n.id} className={`arch-node arch-node-${n.kind || "be"}`}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={3} />
            <text
              x={n.x + n.w / 2}
              y={n.sub ? n.y + n.h / 2 - 3 : n.y + n.h / 2 + 4}
              textAnchor="middle"
              className="arch-node-label"
            >
              {n.label}
            </text>
            {n.sub && (
              <text
                x={n.x + n.w / 2}
                y={n.y + n.h / 2 + 12}
                textAnchor="middle"
                className="arch-node-sub"
              >
                {n.sub}
              </text>
            )}
          </g>
        ))}
      </svg>

      <div className="arch-legend">
        {LEGEND.filter((l) => usedKinds.has(l.kind)).map((l) => (
          <span key={l.kind} className="arch-leg">
            <i className={l.cls} /> {l.label}
          </span>
        ))}
      </div>

      {spec.note && <p className="arch-note">{spec.note}</p>}
    </div>
  );
}
