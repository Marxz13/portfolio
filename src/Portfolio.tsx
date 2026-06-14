"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
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
  EXPERIENCE,
  EDUCATION,
} from "./data/portfolio";

import type { IconType } from "react-icons";
import {
  SiTypescript, SiJavascript, SiPython, SiGo, SiCplusplus, SiKotlin, SiGnubash, SiHtml5, SiCss,
  SiReact, SiNextdotjs, SiExpo, SiTailwindcss, SiShadcnui, SiFlutter, SiVite,
  SiNodedotjs, SiFastapi, SiFlask, SiCelery, SiApachekafka, SiSocketdotio,
  SiPostgresql, SiMongodb, SiRedis, SiSqlite, SiFirebase, SiSupabase,
  SiDigitalocean, SiDocker, SiGithubactions, SiNginx, SiLinux,
  SiGit, SiPytest, SiJest, SiPostman, SiSwagger, SiStripe, SiN8N, SiOpenai, SiTauri,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

type StackItem = { name: string; Icon: IconType };

/* Tech stack shown as animated logo marquees in the About section. */
const STACK: StackItem[] = [
  { name: "TypeScript", Icon: SiTypescript },
  { name: "JavaScript", Icon: SiJavascript },
  { name: "Python", Icon: SiPython },
  { name: "Go", Icon: SiGo },
  { name: "C++", Icon: SiCplusplus },
  { name: "Kotlin", Icon: SiKotlin },
  { name: "Bash", Icon: SiGnubash },
  { name: "HTML5", Icon: SiHtml5 },
  { name: "CSS", Icon: SiCss },
  { name: "React", Icon: SiReact },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "Expo", Icon: SiExpo },
  { name: "Tailwind", Icon: SiTailwindcss },
  { name: "shadcn/ui", Icon: SiShadcnui },
  { name: "Flutter", Icon: SiFlutter },
  { name: "Vite", Icon: SiVite },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "FastAPI", Icon: SiFastapi },
  { name: "Flask", Icon: SiFlask },
  { name: "Celery", Icon: SiCelery },
  { name: "Kafka", Icon: SiApachekafka },
  { name: "Socket.io", Icon: SiSocketdotio },
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "MongoDB", Icon: SiMongodb },
  { name: "Redis", Icon: SiRedis },
  { name: "SQLite", Icon: SiSqlite },
  { name: "Firebase", Icon: SiFirebase },
  { name: "Supabase", Icon: SiSupabase },
  { name: "AWS", Icon: FaAws },
  { name: "DigitalOcean", Icon: SiDigitalocean },
  { name: "Docker", Icon: SiDocker },
  { name: "GitHub Actions", Icon: SiGithubactions },
  { name: "Nginx", Icon: SiNginx },
  { name: "Linux", Icon: SiLinux },
  { name: "Git", Icon: SiGit },
  { name: "PyTest", Icon: SiPytest },
  { name: "Jest", Icon: SiJest },
  { name: "Postman", Icon: SiPostman },
  { name: "Swagger", Icon: SiSwagger },
  { name: "Stripe", Icon: SiStripe },
  { name: "n8n", Icon: SiN8N },
  { name: "OpenAI", Icon: SiOpenai },
  { name: "Tauri", Icon: SiTauri },
];

// split into 3 rows (interleaved so each row is a varied mix)
const STACK_ROWS = [0, 1, 2].map((r) => STACK.filter((_, i) => i % 3 === r));

const LogoChips = ({ items, dup }: { items: StackItem[]; dup?: boolean }) => (
  <div className={dup ? "logo-seq logo-dup" : "logo-seq"} aria-hidden={dup || undefined}>
    {items.map(({ name, Icon }) => (
      <span key={name} className="stack-logo">
        <Icon size={16} aria-hidden="true" /> {name}
      </span>
    ))}
  </div>
);

const LogoMarquee = ({ items, reverse, duration }: { items: StackItem[]; reverse?: boolean; duration: number }) => (
  <div className="logo-marquee">
    <div className="logo-track" data-marquee-track="" style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}>
      <LogoChips items={items} />
      <LogoChips items={items} dup />
    </div>
  </div>
);

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

// Distinct accent-filled CTA used for the résumé download.
const btnAccent: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  background: "var(--accent)",
  color: "var(--bg)",
  textDecoration: "none",
  fontFamily: "var(--mono)",
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.04em",
  padding: "16px 26px",
};

const Square = ({ size = 7, color = "var(--accent)" }: { size?: number; color?: string }) => (
  <span style={{ width: size, height: size, background: color, flex: "none", display: "inline-block" }} />
);


/* ── Work-card hover: slide the hovered card to the row's center and lift
   it forward — like pulling a folder out of a cabinet. Driven with GSAP so
   the centering distance is measured per layout (offsetLeft/Width ignore any
   current transform, so it's robust mid-animation and across breakpoints). */
const CARD_SHADOW_REST = "8px 8px 0 rgba(11,11,12,0.08)";
const CARD_SHADOW_HOVER = "16px 16px 0 rgba(31,70,255,0.18)";
const SHOT_W = 340; // single-screenshot preview width (px)
const PANELS_W = 380; // multi-panel preview width (px)
const SHOT_GAP = 16; // gap between the card and its preview panel

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Work-card hover ──────────────────────────────────────────────
   Handlers live on the stationary ".work-slot" (the hover zone never moves),
   while only the inner ".work-mover" slides — so a card pulled to center can't
   slip out from under the cursor and flicker. A full-page dim overlay fades in
   to focus the active card; cards that carry a screenshot slide further left
   once centered and reveal it on the right. Works for pointer + keyboard.

   `slotTimelines` tracks each slot's active timeline so a re-hover can kill a
   still-running release (and cancel its z-index reset). `hoverZ` is a monotonic
   counter so the newest hover always sits above a card still animating back —
   otherwise two cards momentarily share z-index 50 and DOM order wins, leaving
   the card you just moved to stuck behind the previous one. */
const slotTimelines = new WeakMap<HTMLElement, gsap.core.Timeline>();
let hoverZ = 50;

const pullCardToCenter = (e: { currentTarget: HTMLDivElement }) => {
  if (prefersReduced()) return;
  const slot = e.currentTarget;
  const container = slot.parentElement;
  const mover = slot.querySelector<HTMLElement>(".work-mover");
  if (!container || !mover) return;
  const preview = slot.querySelector<HTMLElement>(".work-preview");
  const dxCenter = (container.clientWidth - slot.offsetWidth) / 2 - slot.offsetLeft;
  // only reveal the side preview if the card + gap + preview fit the row
  const showPreview =
    !!preview && slot.offsetWidth + SHOT_GAP + preview.offsetWidth <= container.clientWidth;

  slotTimelines.get(slot)?.kill();
  hoverZ += 1;
  gsap.set(slot, { zIndex: hoverZ });
  gsap.to("[data-work-dim]", { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });

  const tl = gsap.timeline();
  tl.to(mover, { x: dxCenter, y: -12, scale: 1.04, boxShadow: CARD_SHADOW_HOVER, duration: 0.45, ease: "power3.out" });
  if (showPreview && preview) {
    // once centered, slide left to make room and reveal the preview panel
    tl.to(mover, { x: dxCenter - (preview.offsetWidth + SHOT_GAP) / 2, duration: 0.45, ease: "power3.out" })
      .fromTo(preview, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, "<")
      .set(preview, { pointerEvents: "auto" });
  }
  slotTimelines.set(slot, tl);
};

const releaseCard = (e: { currentTarget: HTMLDivElement }) => {
  if (prefersReduced()) return;
  const slot = e.currentTarget;
  const mover = slot.querySelector<HTMLElement>(".work-mover");
  if (!mover) return;
  const preview = slot.querySelector<HTMLElement>(".work-preview");

  slotTimelines.get(slot)?.kill();
  gsap.to("[data-work-dim]", { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" });

  const tl = gsap.timeline({ onComplete: () => gsap.set(slot, { zIndex: slot.dataset.restZ || "" }) });
  if (preview) {
    gsap.set(preview, { pointerEvents: "none" });
    tl.to(preview, { opacity: 0, x: -16, duration: 0.3, ease: "power2.out" }, 0);
  }
  tl.to(mover, { x: 0, y: 0, scale: 1, boxShadow: CARD_SHADOW_REST, duration: 0.4, ease: "power3.out" }, 0);
  slotTimelines.set(slot, tl);
};

export default function Portfolio() {
  const root = useRef<HTMLDivElement | null>(null);
  const [lightbox, setLightbox] = useState<{ image?: string; label: string } | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);

  // Close the expanded panel on Escape; move focus into the dialog when it opens.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    lightboxCloseRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

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
        .from("[data-hero-shout]", { opacity: 0, y: 22, duration: 0.7 }, "-=0.3")
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

      {/* dims everything but the focused work card while hovering */}
      <div
        data-work-dim=""
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, background: "rgba(11,11,12,0.45)", opacity: 0, pointerEvents: "none", zIndex: 30 }}
      />

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
          <span className="nav-available" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "var(--bg)", background: "var(--accent)", padding: "5px 10px" }}>
            <Square size={7} color="var(--bg)" /> {PROFILE.status}
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
              <div data-hero-eyebrow="" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>
                  <Square /> {PROFILE.role} / {PROFILE.age}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--bg)", background: "var(--accent)", padding: "5px 10px" }}>
                  <Square size={7} color="var(--bg)" /> {PROFILE.status}
                </span>
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
                <a href={PROFILE.cv} download className="btn-accent" style={{ ...btnAccent, textTransform: "uppercase", fontSize: 12, letterSpacing: "0.08em", padding: "15px 24px" }}>
                  Download CV
                </a>
                <span style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 14, borderLeft: "1px solid var(--line)", fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
                  Active on
                  <br />
                  <span style={{ color: "var(--ink)" }}>GitHub</span>
                </span>
              </div>
            </div>
          </div>

          {/* hero bottom — animated shout */}
          <div data-hero-shout="" style={{ position: "relative", zIndex: 1, marginTop: "clamp(24px,4vh,52px)" }}>
            <span className="hero-shout" style={{ display: "inline-block", fontFamily: "var(--pixel)", fontWeight: 700, fontSize: "clamp(1.3rem,3.6vw,2.8rem)", letterSpacing: "0.02em", lineHeight: 1, color: "var(--ink)" }}>
              AHHHHHHHHHHHHHH I WANT <span style={{ color: "var(--accent)" }}>PROBLEM!!</span>
            </span>
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

            {/* stack — endless logo marquees, alternating direction per row */}
            <div data-reveal="" style={{ position: "relative", zIndex: 1, marginTop: "clamp(32px,5vh,52px)" }}>
              <div style={{ ...monoLabel, marginBottom: 16 }}>// Stack</div>
              {STACK_ROWS.map((row, i) => (
                <LogoMarquee key={i} items={row} reverse={i % 2 === 1} duration={[34, 28, 38][i]} />
              ))}
            </div>

            {/* education */}
            <div data-reveal="" style={{ position: "relative", zIndex: 1, marginTop: "clamp(30px,4.5vh,48px)" }}>
              <div style={{ ...monoLabel, marginBottom: 12 }}>// Education</div>
              {EDUCATION.map((ed) => (
                <div key={ed.school} style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 14px" }}>
                  <span style={{ fontFamily: "var(--sans)", fontWeight: 600, fontSize: "clamp(1.1rem,1.7vw,1.4rem)" }}>{ed.school}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>{ed.period}</span>
                  <div style={{ flexBasis: "100%", fontSize: 15, lineHeight: 1.6, color: "var(--muted)", marginTop: 3 }}>
                    {ed.detail}
                    {ed.location ? ` · ${ed.location}` : ""}
                  </div>
                </div>
              ))}
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
                  <div
                    key={p.index}
                    className="work-slot"
                    data-reveal=""
                    data-rest-z={3 + i}
                    onMouseEnter={pullCardToCenter}
                    onMouseLeave={releaseCard}
                    onFocus={(ev) => {
                      if (!ev.currentTarget.contains(ev.relatedTarget as Node)) pullCardToCenter(ev);
                    }}
                    onBlur={(ev) => {
                      if (!ev.currentTarget.contains(ev.relatedTarget as Node)) releaseCard(ev);
                    }}
                    style={{
                      position: "relative",
                      alignSelf: right ? "flex-end" : "flex-start",
                      width: "min(100%,720px)",
                      // heavy overlap = tightly packed, file-cabinet stack
                      marginTop: i === 0 ? 0 : "clamp(-160px,-13vw,-120px)",
                      zIndex: 3 + i,
                    }}
                  >
                    <div className="work-mover" style={{ position: "relative", boxShadow: "8px 8px 0 rgba(11,11,12,0.08)" }}>
                      <a
                        href={isLink ? p.href : undefined}
                        target={isLink ? "_blank" : undefined}
                        rel={isLink ? "noopener noreferrer" : undefined}
                        className="work-card"
                        style={{
                          position: "relative",
                          display: "block",
                          background: "var(--bg)",
                          border: "1px solid var(--ink)",
                          padding: "clamp(18px,2.4vw,28px)",
                          textDecoration: "none",
                          color: "var(--ink)",
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
                      {p.screenshot && (
                        <a
                          className="work-preview work-shot"
                          href={isLink ? p.href : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={-1}
                          aria-label={p.screenshotCta}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: `calc(100% + ${SHOT_GAP}px)`,
                            width: SHOT_W,
                            aspectRatio: "1882 / 1085",
                            border: "1px solid var(--ink)",
                            background: "var(--bg-2)",
                            boxShadow: "8px 8px 0 rgba(11,11,12,0.08)",
                            overflow: "hidden",
                            opacity: 0,
                            pointerEvents: "none",
                            textDecoration: "none",
                          }}
                        >
                          <img
                            src={p.screenshot}
                            alt={`${p.name} — Chrome extension screenshot`}
                            style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <span
                            className="work-shot-cta"
                            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(11,11,12,0.62)", color: "var(--bg)", fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", opacity: 0 }}
                          >
                            {p.screenshotCta} <span aria-hidden="true">&#8599;</span>
                          </span>
                        </a>
                      )}
                      {p.panels && (
                        <div
                          className="work-preview work-panels"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: `calc(100% + ${SHOT_GAP}px)`,
                            width: PANELS_W,
                            height: "100%",
                            display: "grid",
                            gridTemplateColumns: p.panels.length >= 4 ? "1fr 1fr" : "1fr",
                            gridAutoRows: "1fr",
                            gap: 10,
                            opacity: 0,
                            pointerEvents: "none",
                          }}
                        >
                          {p.panels.map((panel) => (
                            <button
                              key={panel.label}
                              type="button"
                              className="work-panel"
                              aria-label={`Expand ${panel.label}`}
                              onClick={(ev) => {
                                ev.stopPropagation();
                                setLightbox({ image: panel.image, label: panel.label });
                              }}
                              style={{ position: "relative", border: "1px solid var(--ink)", background: "var(--bg-2)", cursor: "pointer", overflow: "hidden", padding: 0 }}
                            >
                              {panel.image && (
                                <img src={panel.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                              )}
                              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px", textAlign: "center", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.03em", color: "var(--ink)" }}>
                                {panel.label}
                              </span>
                              <span className="work-panel-expand" aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(31,70,255,0.92)", color: "var(--bg)", fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", opacity: 0 }}>
                                Expand &#8599;
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ──────────────────────────────────────── */}
        <section id="experience" data-screen-label="Experience" style={{ position: "relative", overflow: "hidden", background: "var(--bg-2)", borderTop: "1px solid var(--ink)" }}>
          <div style={container}>
            <span className="section-num" style={{ ...watermark, bottom: "clamp(-30px,-3vw,-10px)", left: "clamp(-20px,-1vw,0px)", color: "rgba(11,11,12,0.05)" }}>03</span>
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
              <Square /> 04 / Contact
            </div>
            <h2 data-reveal="" style={{ position: "relative", margin: 0, lineHeight: 0.84 }}>
              <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, fontFamily: "var(--pixel)", fontWeight: 700, fontSize: "clamp(3.2rem,12vw,9rem)", color: accentTint(22), transform: "translate(10px,10px)", letterSpacing: "0.01em" }}>
                LET&apos;S BUILD.
              </span>
              <span style={{ position: "relative", fontFamily: "var(--pixel)", fontWeight: 700, fontSize: "clamp(3.2rem,12vw,9rem)", color: "var(--ink)", letterSpacing: "0.01em" }}>
                LET&apos;S <span style={{ color: "var(--accent)" }}>BUILD.</span>
              </span>
            </h2>

            <p data-reveal="" style={{ position: "relative", zIndex: 2, margin: "clamp(20px,3vh,30px) 0 0", maxWidth: "54ch", fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(1.05rem,1.7vw,1.35rem)", lineHeight: 1.5 }}>
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>{PROFILE.status}.</span> {PROFILE.availability}
            </p>

            <div data-reveal="" style={{ position: "relative", zIndex: 2, display: "flex", flexWrap: "wrap", gap: 12, marginTop: "clamp(20px,3vh,28px)" }}>
              <a href={`mailto:${PROFILE.email}`} className="btn-dark" style={btnDark}>
                {PROFILE.email} <span aria-hidden="true">&#9632;</span>
              </a>
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={btnGhost} aria-label={`GitHub profile ${PROFILE.githubHandle} (opens in a new tab)`}>
                github / {PROFILE.githubHandle}
              </a>
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={btnGhost} aria-label="LinkedIn profile (opens in a new tab)">
                linkedin
              </a>
              <a href={PROFILE.cv} download className="btn-accent" style={btnAccent}>
                download cv
              </a>
            </div>

            {/* contribution band */}
            <div data-reveal="" style={{ position: "relative", zIndex: 2, marginTop: "clamp(48px,8vh,90px)", border: "1px solid var(--ink)", background: "var(--bg)", padding: "clamp(22px,4vw,38px)", boxShadow: `10px 10px 0 ${accentTint(14)}` }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
                <div>
                  <div style={{ ...monoLabel, letterSpacing: "0.06em", marginBottom: 8 }}>This year on GitHub</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--muted)", maxWidth: "44ch", lineHeight: 1.5 }}>
                    A steady year of commits — public &amp; private.
                  </div>
                </div>
                <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)", textDecoration: "none" }} aria-label={`Open github.com/${PROFILE.githubHandle.replace("@", "")} (opens in a new tab)`}>
                  github.com/{PROFILE.githubHandle.replace("@", "")} <span aria-hidden="true">&#8599;</span>
                </a>
              </div>
              <ContributionGraph />
            </div>

            <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginTop: "clamp(44px,7vh,72px)", paddingTop: 24, borderTop: "1px solid var(--line)", fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--muted)" }}>
              <span>&#169; 2026 {PROFILE.fullName} — {PROFILE.role}</span>
              <span>Built with GSAP · pixel-perfect</span>
            </footer>
          </div>
        </section>
      </main>

      {/* expanded panel preview */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.label} preview`}
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(20px,5vw,64px)", background: "rgba(11,11,12,0.82)" }}
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            style={{ position: "relative", width: "100%", maxWidth: "min(1100px, 92vw)", maxHeight: "88vh", display: "flex", flexDirection: "column", background: "var(--bg)", border: "1px solid var(--ink)", boxShadow: "16px 16px 0 rgba(31,70,255,0.18)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{lightbox.label}</span>
              <button
                type="button"
                ref={lightboxCloseRef}
                onClick={() => setLightbox(null)}
                aria-label="Close preview"
                className="btn-ghost"
                style={{ ...btnGhost, gap: 8, padding: "8px 14px", fontSize: 12, cursor: "pointer", background: "none" }}
              >
                Close <span aria-hidden="true">&#10005;</span>
              </button>
            </div>
            <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-2)", overflow: "auto" }}>
              {lightbox.image ? (
                <img src={lightbox.image} alt={`${lightbox.label} screenshot`} style={{ display: "block", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              ) : (
                <div style={{ padding: "clamp(48px,10vw,120px)", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--pixel)", fontWeight: 700, fontSize: "clamp(2rem,5vw,3.4rem)", color: "var(--ink)", marginBottom: 12 }}>{lightbox.label}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--muted)" }}>screenshot coming soon</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
