import { useMemo } from "react";

/**
 * ContributionGraph
 * ─────────────────
 * GitHub-style heatmap rendered as a CSS grid (7 rows, column flow).
 * Levels are seeded deterministically so SSR and client match.
 * Top level uses the accent colour; the rest are ink tints.
 */
export interface ContributionGraphProps {
  /** Number of day-cells (≈ 53 weeks × 7). */
  count?: number;
  seed?: number;
}

const LEVEL_COLORS = [
  "rgba(11,11,12,0.06)",
  "rgba(11,11,12,0.20)",
  "rgba(11,11,12,0.40)",
  "rgba(11,11,12,0.66)",
  "var(--accent)",
];

function levelsFor(count: number, seed: number): number[] {
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  return Array.from({ length: count }, () => {
    const r = rnd();
    if (r < 0.06) return 0;
    if (r < 0.24) return 1;
    if (r < 0.54) return 2;
    if (r < 0.82) return 3;
    return 4;
  });
}

export default function ContributionGraph({
  count = 371,
  seed = 1337,
}: ContributionGraphProps) {
  const levels = useMemo(() => levelsFor(count, seed), [count, seed]);

  return (
    // Horizontally scrollable so the full deterministic year is reachable on
    // narrow screens instead of being silently clipped.
    <div style={{ overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch" }}>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "repeat(7, 1fr)",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(8px, 1fr)",
          gap: 3,
          height: 104,
          minWidth: 640,
        }}
      >
        {levels.map((lvl, i) => (
          <div
            key={i}
            style={{ width: "100%", height: "100%", background: LEVEL_COLORS[lvl] }}
          />
        ))}
      </div>
    </div>
  );
}
