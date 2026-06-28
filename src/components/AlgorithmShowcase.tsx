"use client";

import type { IconType } from "react-icons";
import { FiUser, FiSearch, FiMousePointer, FiActivity, FiCpu, FiGrid, FiChevronRight } from "react-icons/fi";
import ArchitectureDiagram from "./ArchitectureDiagram";
import type { AlgoSpec, AlgoIcon } from "../data/portfolio";

const STEP_ICONS: Record<AlgoIcon, IconType> = {
  buyer: FiUser,
  search: FiSearch,
  click: FiMousePointer,
  signal: FiActivity,
  profile: FiCpu,
  feed: FiGrid,
};

/* Displays a project's signature algorithm: a flow diagram (reusing the
   ArchitectureDiagram renderer), the ranking factors as weighted bars, and
   grouped detail lists. All content is data-driven from AlgoSpec. */
export default function AlgorithmShowcase({ spec }: { spec: AlgoSpec }) {
  const maxWeight = spec.factors
    ? Math.max(...spec.factors.items.map((f) => f.weight))
    : 1;

  return (
    <div className="algo-wrap">
      <div className="algo-head">
        <h4 className="algo-title">{spec.title}</h4>
        <p className="algo-summary">{spec.summary}</p>
      </div>

      {spec.flow && <ArchitectureDiagram spec={spec.flow} />}

      {spec.factors && (
        <div className="algo-factors">
          <div className="algo-sub">{spec.factors.title}</div>
          {spec.factors.items.map((f) => (
            <div key={f.label} className="algo-bar-row">
              <span className="algo-bar-label">{f.label}</span>
              <span className="algo-bar">
                <i style={{ width: `${(f.weight / maxWeight) * 100}%` }} />
              </span>
              <span className="algo-bar-val">{Math.round(f.weight * 100)}%</span>
            </div>
          ))}
        </div>
      )}

      {spec.groups && (
        <div className="algo-groups">
          {spec.groups.map((g) => (
            <div key={g.title} className="algo-group">
              <div className="algo-sub">{g.title}</div>
              <ul>
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {spec.example && (
        <div className="algo-example">
          <div className="algo-sub">See it work — {spec.example.persona}</div>

          <div className="algo-story">
            {spec.example.steps.map((s, i) => {
              const StepIcon = STEP_ICONS[s.icon];
              return (
                <div key={s.title} className="algo-step-wrap">
                  <div className="algo-step">
                    <span className="algo-step-icon" aria-hidden="true"><StepIcon size={16} /></span>
                    <span className="algo-step-title">{s.title}</span>
                    <span className="algo-step-detail">{s.detail}</span>
                  </div>
                  {i < spec.example!.steps.length - 1 && (
                    <FiChevronRight className="algo-arrow" size={16} aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="algo-feed-title">{spec.example.feedTitle}</div>
          <div className="algo-feed">
            {spec.example.feed.map((item) => (
              <div key={item.name} className={item.boosted ? "algo-tile is-boosted" : "algo-tile"}>
                <div className="algo-tile-top">
                  <span className="algo-tile-name">{item.name}</span>
                  {item.tag && <span className="algo-tile-tag">{item.tag}</span>}
                </div>
                <span className="algo-tile-reason">{item.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {spec.note && <p className="algo-note">{spec.note}</p>}
    </div>
  );
}
