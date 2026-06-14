import { CSSProperties } from "react";

/**
 * Marquee
 * ───────
 * Full-bleed infinite ticker. The track holds the sequence twice and
 * animates translateX 0 → -50% (CSS keyframes `marz-marquee`), so the
 * loop is seamless. Pixel-square separators between items.
 */
export interface MarqueeProps {
  items: string[];
  /** Seconds for one full loop. */
  duration?: number;
}

const sep: CSSProperties = {
  width: 10,
  height: 10,
  background: "var(--accent)",
  margin: "0 26px",
  flex: "none",
};

function Sequence({ items, ariaHidden }: { items: string[]; ariaHidden?: boolean }) {
  return (
    <span
      aria-hidden={ariaHidden}
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      {items.map((item, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
          {item}
          <span style={sep} />
        </span>
      ))}
    </span>
  );
}

export default function Marquee({ items, duration = 26 }: MarqueeProps) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--ink)",
        borderBottom: "1px solid var(--ink)",
        background: "var(--ink)",
        color: "var(--bg)",
        padding: "13px 0",
      }}
    >
      <div
        data-marquee-track=""
        style={{
          display: "flex",
          width: "max-content",
          animation: `marz-marquee ${duration}s linear infinite`,
          fontFamily: "var(--pixel)",
          fontWeight: 600,
          fontSize: "clamp(1.1rem, 1.9vw, 1.6rem)",
          letterSpacing: "0.05em",
          whiteSpace: "nowrap",
        }}
      >
        <Sequence items={items} />
        <Sequence items={items} ariaHidden />
      </div>
    </div>
  );
}
