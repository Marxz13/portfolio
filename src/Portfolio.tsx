"use client";

import { CSSProperties, MouseEvent as ReactMouseEvent, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./styles/portfolio.css";
import PixelPortrait from "./components/PixelPortrait";
import Marquee from "./components/Marquee";
import ContributionGraph from "./components/ContributionGraph";
import {
  PROFILE,
  NAV,
  MARQUEE,
  PROJECTS,
  SKILLS,
  EXPERIENCE,
} from "./data/portfolio";

gsap.registerPlugin(ScrollTrigger);

/* ── token-derived accent tints (single source: --accent) ────────── */
const accentTint = (pct: number) =>
  `color-mix(in srgb, var(--accent) ${pct}%, transparent)`;

/* ── shared style fragments ──────────────────────────────────── */
const container: CSSProperties = {
  position: "relative",
  maxWidth: 1280,
  margin: "0 auto",
  padding: "clamp(72px,12vh,140px) clamp(20px,5vw,64px)",
};

const sectionTitle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--sans)",
  fontWeight: 600,
  fontSize: "clamp(1.7rem,3.2vw,2.6rem)",
  letterSpacing: "-0.01em",
};

const watermark: CSSProperties = {
  position: "absolute",
  fontFamily: "var(--pixel)",
  fontWeight: 700,
  fontSize: "clamp(9rem,26vw,22rem)",
  lineHeight: 0.7,
  zIndex: 0,
  pointerEvents: "none",
  userSelect: "none",
};

const monoLabel: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 12,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--muted)",
};

const chip: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  color: "var(--muted)",
  border: "1px solid var(--line)",
  padding: "4px 9px",
};

const btnDark: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  background: "var(--ink)",
  color: "var(--bg)",
  textDecoration: "none",
  fontFamily: "var(--mono)",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.04em",
  padding: "16px 26px",
};

const btnGhost: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  border: "1px solid var(--ink)",
  color: "var(--ink)",
  textDecoration: "none",
  fontFamily: "var(--mono)",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.04em",
  padding: "15px 24px",
};

// "Download CV" has no real destination yet — render it as a disabled button
// rather than a focusable href="#" dead-end. Swap for <a href={cv} download>
// once a résumé URL exists.
const btnGhostDisabled: CSSProperties = {
  ...btnGhost,
  background: "none",
  cursor: "not-allowed",
  opacity: 0.5,
};

const Square = ({ size = 7, color = "var(--accent)" }: { size?: number; color?: string }) => (
  <span style={{ width: size, height: size, background: color, flex: "none", display: "inline-block" }} />
);

const SKILL_OFFSETS = ["0px", "clamp(0px,4vw,52px)", "clamp(0px,8vw,104px)"];

/* ── Work-card hover: slide the hovered card to the row's center and lift
   it forward — like pulling a folder out of a cabinet. Driven with GSAP so
   the centering distance is measured per layout (offsetLeft/Width ignore any
   current transform, so it's robust mid-animation and across breakpoints). */
const CARD_SHADOW_REST = "8px 8px 0 rgba(11,11,12,0.08)";
const CARD_SHADOW_HOVER = "16px 16px 0 rgba(31,70,255,0.18)";

const pullCardToCenter = (e: ReactMouseEvent<HTMLAnchorElement>) => {
  const card = e.currentTarget;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const container = card.parentElement;
  if (!container) return;
  const dx = (container.clientWidth - card.offsetWidth) / 2 - card.offsetLeft;
  gsap.set(card, { zIndex: 50 });
  gsap.to(card, {
    x: dx,
    y: -10,
    scale: 1.03,
    boxShadow: CARD_SHADOW_HOVER,
    duration: 0.45,
    ease: "power3.out",
    overwrite: "auto",
  });
};

const releaseCard = (e: ReactMouseEvent<HTMLAnchorElement>) => {
  const card = e.currentTarget;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.to(card, {
    x: 0,
    y: 0,
    scale: 1,
    boxShadow: CARD_SHADOW_REST,
    duration: 0.45,
    ease: "power3.out",
    overwrite: "auto",
    onComplete: () => gsap.set(card, { zIndex: card.dataset.restZ || "" }),
  });
};

export default function Portfolio() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Respect the user's reduced-motion preference: skip every GSAP entrance
    // and scroll reveal, leaving all content statically visible. (The marquee
    // is paused separately via CSS, and a CSS fallback keeps [data-reveal]
    // visible whenever its tween never runs.)
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-nav]", { opacity: 0, y: -16, duration: 0.6, ease: "power3.out" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
      tl.from("[data-hero-eyebrow]", { opacity: 0, y: 16, duration: 0.6 })
        .from("[data-hero-title] > span", { opacity: 0, y: 30, duration: 0.85 }, "-=0.3")
        .from("[data-hero-statement]", { opacity: 0, y: 24, duration: 0.7 }, "-=0.45")
        .from("[data-hero-text]", { opacity: 0, y: 18, duration: 0.7 }, "-=0.45")
        .from("[data-hero-meta] > *", { opacity: 0, y: 14, duration: 0.6, stagger: 0.09 }, "-=0.45")
        .from("[data-hero-frame]", { opacity: 0, x: -20, duration: 0.9, ease: "power2.out" }, 0.12);

      // safety: snap to end if the timeline never advances (throttled tab)
      const heroSafety = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 2900);

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      reveals.forEach((node) => {
        gsap.from(node, {
          opacity: 0,
          y: 26,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 90%" },
        });
      });

      // Web fonts can shift layout after ScrollTrigger measures the page;
      // re-measure once they settle so below-fold triggers fire correctly.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      // safety: unconditionally un-hide any reveal still at opacity 0 (e.g. a
      // trigger that never fired after a scroll-position restore), regardless
      // of its position in the page.
      const revealSafety = window.setTimeout(() => {
        reveals.forEach((node) => {
          if (parseFloat(getComputedStyle(node).opacity) < 0.05) {
            gsap.set(node, { clearProps: "opacity,transform" });
          }
        });
      }, 3200);

      return () => {
        clearTimeout(heroSafety);
        clearTimeout(revealSafety);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="portfolio" ref={root}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav
        data-nav=""
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px clamp(20px,5vw,64px)",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", color: "var(--ink)" }}>
          <Square size={10} />
          <span style={{ fontFamily: "var(--pixel)", fontWeight: 600, fontSize: 22, letterSpacing: "0.04em" }}>
            {PROFILE.name}
          </span>
        </a>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "clamp(16px,2.4vw,36px)" }}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="nav-link" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", textDecoration: "none" }}>
              {n.label}
            </a>
          ))}
          <span className="nav-available" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink)" }}>
            <Square size={8} /> available
          </span>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} style={{ outline: "none" }}>
        {/* ── HERO ────────────────────────────────────────────── */}
        <header
          id="top"
          data-screen-label="Hero"
          style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "clamp(36px,6vh,72px) clamp(20px,5vw,64px) clamp(28px,5vh,56px)" }}
        >
          <span style={{ position: "absolute", top: "clamp(20px,5vh,60px)", right: "clamp(20px,5vw,64px)", width: 16, height: 16, background: "var(--accent)" }} />
          <span style={{ position: "absolute", bottom: 8, left: "clamp(60px,16vw,220px)", width: 11, height: 11, background: "var(--ink)" }} />

          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,420px) 1fr", gap: "clamp(24px,5vw,60px)", alignItems: "center", minHeight: "min(80vh,740px)" }}>
            {/* portrait — name overlaps its right edge */}
            <div data-hero-frame="" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
              <span style={{ position: "absolute", top: -6, left: -6, width: 16, height: 16, background: "var(--accent)", zIndex: 3 }} />
              <PixelPortrait src={PROFILE.photo} label={`Portrait of ${PROFILE.name}, ${PROFILE.role}`} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 11, fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
                <span>marz.png</span>
                <span>[ pixel-rendered ]</span>
              </div>
            </div>

            {/* intro */}
            <div style={{ position: "relative", zIndex: 2 }}>
              <div data-hero-eyebrow="" style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
                <Square /> {PROFILE.role} / {PROFILE.age}
              </div>
              <h1 data-hero-title="" style={{ margin: 0, lineHeight: 0.82 }}>
                <span className="hero-wordmark" style={{ display: "block", position: "relative", marginLeft: "clamp(-210px,-16vw,-70px)" }}>
                  <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, fontFamily: "var(--pixel)", fontWeight: 700, fontSize: "clamp(4rem,12.5vw,9.5rem)", color: accentTint(22), letterSpacing: "0.01em", transform: "translate(11px,11px)", zIndex: 0 }}>
                    {PROFILE.name}
                  </span>
                  <span style={{ position: "relative", fontFamily: "var(--pixel)", fontWeight: 700, fontSize: "clamp(4rem,12.5vw,9.5rem)", color: "var(--ink)", letterSpacing: "0.01em", zIndex: 1 }}>
                    {PROFILE.name}
                  </span>
                </span>
              </h1>
              <p data-hero-statement="" style={{ margin: "0.55em 0 0", fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(1.2rem,2.3vw,1.85rem)", lineHeight: 1.2, maxWidth: "22ch" }}>
                {PROFILE.statement}
              </p>
              <p data-hero-text="" style={{ maxWidth: "46ch", margin: "24px 0 0", fontSize: "clamp(14px,1.1vw,16px)", lineHeight: 1.65, color: "var(--muted)" }}>
                {PROFILE.intro}
              </p>
              <div data-hero-meta="" style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: 12, marginTop: 32 }}>
                <a href="#work" className="btn-dark" style={{ ...btnDark, textTransform: "uppercase", fontSize: 12, letterSpacing: "0.08em", padding: "15px 24px" }}>
                  View work <span aria-hidden="true">&#9632;</span>
                </a>
                <button type="button" className="btn-ghost" disabled aria-disabled="true" title="CV coming soon" style={{ ...btnGhostDisabled, textTransform: "uppercase", fontSize: 12, letterSpacing: "0.08em", padding: "14px 22px" }}>
                  Download CV
                </button>
                <span style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 14, borderLeft: "1px solid var(--line)", fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
                  {PROFILE.contributions.toLocaleString()} commits
                  <br />
                  <span style={{ color: "var(--ink)" }}>this year</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ── MARQUEE ─────────────────────────────────────────── */}
        <Marquee items={MARQUEE} />

        {/* ── ABOUT ───────────────────────────────────────────── */}
        <section id="about" data-screen-label="About" style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ ...container, padding: "clamp(80px,13vh,150px) clamp(20px,5vw,64px)" }}>
            <span className="section-num" style={{ ...watermark, top: "clamp(-30px,-3vw,0px)", right: "clamp(-30px,-2vw,0px)", color: accentTint(7) }}>01</span>
            <div className="about-lede" style={{ position: "relative", zIndex: 1, maxWidth: "62%" }}>
              <div data-reveal="" style={{ ...monoLabel, marginBottom: 24 }}>// About</div>
              <p data-reveal="" style={{ margin: 0, fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(1.5rem,3vw,2.7rem)", lineHeight: 1.26, letterSpacing: "-0.01em" }}>
                I care about the details most people skip — the empty states, the loading flicker, the migration that runs at 3am{" "}
                <span style={{ color: "var(--accent)" }}>without waking anyone.</span>
              </p>
            </div>
            <p data-reveal="" className="about-aside" style={{ position: "relative", zIndex: 1, margin: "34px 0 0", marginLeft: "auto", maxWidth: "50ch", fontSize: 16, lineHeight: 1.7, color: "var(--muted)", textAlign: "right" }}>
              I&apos;m a fullstack developer who likes quiet focus and loud results — designing the database, wiring the API, polishing the last pixel. I judge my work by one thing: did it actually ship, and does it hold up.
            </p>
          </div>
        </section>

        {/* ── WORK ────────────────────────────────────────────── */}
        <section id="work" data-screen-label="Work" style={{ position: "relative", overflow: "hidden", background: "var(--bg-2)", borderTop: "1px solid var(--ink)" }}>
          <div style={container}>
            <span className="section-num" style={{ ...watermark, top: "clamp(20px,4vw,60px)", left: "clamp(-20px,-1vw,0px)", color: "rgba(11,11,12,0.05)" }}>02</span>
            <div data-reveal="" style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "baseline", gap: 16, marginBottom: "clamp(34px,6vh,64px)" }}>
              <h2 style={sectionTitle}>Selected Work</h2>
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>[ 2024 — 2027 ]</span>
            </div>

            <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
              {PROJECTS.map((p, i) => {
                const right = i % 2 === 1;
                const isLink = Boolean(p.href && p.href !== "#");
                return (
                  <a
                    key={p.index}
                    href={isLink ? p.href : undefined}
                    target={isLink ? "_blank" : undefined}
                    rel={isLink ? "noopener noreferrer" : undefined}
                    data-reveal=""
                    data-rest-z={3 + i}
                    className="work-card"
                    onMouseEnter={pullCardToCenter}
                    onMouseLeave={releaseCard}
                    style={{
                      position: "relative",
                      alignSelf: right ? "flex-end" : "flex-start",
                      width: "min(100%,720px)",
                      marginTop: i === 0 ? 0 : "clamp(-44px,-4vw,-24px)",
                      zIndex: 3 + i,
                      background: "var(--bg)",
                      border: "1px solid var(--ink)",
                      padding: "clamp(24px,3vw,40px)",
                      textDecoration: "none",
                      color: "var(--ink)",
                      boxShadow: "8px 8px 0 rgba(11,11,12,0.08)",
                    }}
                  >
                    <span style={{ position: "absolute", top: "clamp(-30px,-2.4vw,-18px)", [right ? "left" : "right"]: 18, fontFamily: "var(--pixel)", fontWeight: 700, fontSize: "clamp(3rem,6vw,5rem)", color: "var(--bg)", WebkitTextStroke: "2px var(--ink)", lineHeight: 1 } as CSSProperties}>
                      {p.index}
                    </span>
                    <h3 style={{ margin: 0, fontFamily: "var(--pixel)", fontWeight: 600, fontSize: "clamp(1.9rem,3vw,2.6rem)", lineHeight: 1, letterSpacing: "0.01em" }}>
                      {p.name}
                    </h3>
                    {p.timeline && (
                      <div style={{ marginTop: 8, fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", letterSpacing: "0.04em" }}>
                        {p.timeline}
                      </div>
                    )}
                    <p style={{ margin: "12px 0 0", maxWidth: "46ch", fontSize: 15, lineHeight: 1.6, color: "var(--muted)" }}>
                      {p.description}
                    </p>
                    {p.metric && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.03em", color: "var(--accent)" }}>
                        <Square size={7} /> {p.metric}
                      </div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 18 }}>
                      {p.tech.map((t) => (
                        <span key={t} style={chip}>{t}</span>
                      ))}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SKILLS ──────────────────────────────────────────── */}
        <section id="skills" data-screen-label="Skills" style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--ink)" }}>
          <div style={container}>
            <span className="section-num" style={{ ...watermark, top: "clamp(-20px,-1vw,10px)", right: "clamp(-20px,-1vw,0px)", color: accentTint(7) }}>03</span>
            <h2 data-reveal="" style={{ ...sectionTitle, position: "relative", zIndex: 1, marginBottom: "clamp(34px,6vh,60px)" }}>The Stack</h2>
            <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "clamp(24px,4vw,48px)", alignItems: "start" }}>
              {SKILLS.map((group, i) => (
                <div key={group.label} data-reveal="" className="stack-col" style={{ marginTop: SKILL_OFFSETS[i] ?? 0 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink)", paddingBottom: 14, borderBottom: "2px solid var(--accent)", marginBottom: 18 }}>
                    {group.label}
                  </div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 13, fontSize: 16 }}>
                    {group.items.map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <Square /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ──────────────────────────────────────── */}
        <section id="experience" data-screen-label="Experience" style={{ position: "relative", overflow: "hidden", background: "var(--bg-2)", borderTop: "1px solid var(--ink)" }}>
          <div style={container}>
            <span className="section-num" style={{ ...watermark, bottom: "clamp(-30px,-3vw,-10px)", left: "clamp(-20px,-1vw,0px)", color: "rgba(11,11,12,0.05)" }}>04</span>
            <h2 data-reveal="" style={{ ...sectionTitle, position: "relative", zIndex: 1, marginBottom: "clamp(34px,6vh,60px)" }}>Experience</h2>

            {EXPERIENCE.map((e, i) => (
              <div
                key={e.period}
                data-reveal=""
                className="exp-row"
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "grid",
                  gridTemplateColumns: "150px 1fr",
                  gap: "clamp(14px,3vw,40px)",
                  padding: "26px clamp(20px,3vw,36px)",
                  border: "1px solid var(--ink)",
                  borderTop: i === 0 ? "1px solid var(--ink)" : "none",
                  background: "var(--bg)",
                  width: "min(100%,720px)",
                  marginLeft: i % 2 === 1 ? "auto" : undefined,
                  marginRight: i % 2 === 0 ? "auto" : undefined,
                }}
              >
                <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: e.current ? "var(--accent)" : "var(--muted)", fontWeight: e.current ? 700 : 400 }}>
                  {e.period}
                </span>
                <div>
                  <h3 style={{ margin: 0, fontFamily: "var(--sans)", fontWeight: 600, fontSize: "clamp(1.3rem,2.1vw,1.7rem)" }}>{e.role}</h3>
                  <p style={{ margin: "9px 0 0", maxWidth: "54ch", fontSize: 15, lineHeight: 1.6, color: "var(--muted)" }}>{e.blurb}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACT ─────────────────────────────────────────── */}
        <section id="contact" data-screen-label="Contact" style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--ink)" }}>
          <div style={{ ...container, paddingBottom: "clamp(48px,8vh,90px)" }}>
            <div data-reveal="" style={{ display: "flex", alignItems: "center", gap: 12, ...monoLabel, marginBottom: 8 }}>
              <Square /> 05 / Contact
            </div>
            <h2 data-reveal="" style={{ position: "relative", margin: 0, lineHeight: 0.84 }}>
              <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, fontFamily: "var(--pixel)", fontWeight: 700, fontSize: "clamp(3.2rem,12vw,9rem)", color: accentTint(22), transform: "translate(10px,10px)", letterSpacing: "0.01em" }}>
                LET&apos;S BUILD.
              </span>
              <span style={{ position: "relative", fontFamily: "var(--pixel)", fontWeight: 700, fontSize: "clamp(3.2rem,12vw,9rem)", color: "var(--ink)", letterSpacing: "0.01em" }}>
                LET&apos;S <span style={{ color: "var(--accent)" }}>BUILD.</span>
              </span>
            </h2>

            <div data-reveal="" style={{ position: "relative", zIndex: 2, display: "flex", flexWrap: "wrap", gap: 12, marginTop: "clamp(28px,4vh,44px)" }}>
              <a href={`mailto:${PROFILE.email}`} className="btn-dark" style={btnDark}>
                {PROFILE.email} <span aria-hidden="true">&#9632;</span>
              </a>
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={btnGhost} aria-label={`GitHub profile ${PROFILE.githubHandle} (opens in a new tab)`}>
                github / {PROFILE.githubHandle}
              </a>
              <button type="button" className="btn-ghost" disabled aria-disabled="true" title="CV coming soon" style={btnGhostDisabled}>
                download cv
              </button>
            </div>

            {/* contribution band */}
            <div data-reveal="" style={{ position: "relative", zIndex: 2, marginTop: "clamp(48px,8vh,90px)", border: "1px solid var(--ink)", background: "var(--bg)", padding: "clamp(22px,4vw,38px)", boxShadow: `10px 10px 0 ${accentTint(14)}` }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
                <div>
                  <div style={{ ...monoLabel, letterSpacing: "0.06em", marginBottom: 6 }}>This year on GitHub</div>
                  <div style={{ fontFamily: "var(--pixel)", fontWeight: 700, fontSize: "clamp(2.6rem,6vw,4rem)", lineHeight: 0.9 }}>
                    {PROFILE.contributions.toLocaleString()}{" "}
                    <span style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "0.32em", color: "var(--muted)", letterSpacing: 0 }}>
                      contributions
                    </span>
                  </div>
                </div>
                <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)", textDecoration: "none" }} aria-label={`Open github.com/${PROFILE.githubHandle.replace("@", "")} (opens in a new tab)`}>
                  github.com/{PROFILE.githubHandle.replace("@", "")} <span aria-hidden="true">&#8599;</span>
                </a>
              </div>
              <ContributionGraph />
            </div>

            <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginTop: "clamp(44px,7vh,72px)", paddingTop: 24, borderTop: "1px solid var(--line)", fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--muted)" }}>
              <span>&#169; 2026 {PROFILE.name} — {PROFILE.role}</span>
              <span>Built with GSAP · pixel-perfect</span>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
