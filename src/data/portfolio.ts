/* ───────────────────────────────────────────────────────────
   Portfolio content — single source of truth.
   Swap these values for the real ones; the components are
   purely presentational and read everything from here.
   ─────────────────────────────────────────────────────────── */

export interface Profile {
  name: string;
  role: string;
  age: number;
  email: string;
  github: string;
  githubHandle: string;
  /** Annual GitHub contribution count shown in the stats band. */
  contributions: number;
  /** Portrait used by the pixelization canvas. Replace with your own. */
  photo: string;
  /** Short hero intro paragraph. */
  intro: string;
  /** Hero statement under the wordmark. */
  statement: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Project {
  index: string;        // "01"
  name: string;
  description: string;
  tech: string[];
  /** Optional traction/highlight shown on the card, e.g. "454 live users worldwide". */
  metric?: string;
  /** Optional build timeline, e.g. "2024 — EOY 2026". */
  timeline?: string;
  href: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ExperienceEntry {
  period: string;       // "2024 — NOW"
  role: string;
  blurb: string;
  current?: boolean;
}

export const PROFILE: Profile = {
  name: "MARZ",
  role: "Fullstack Developer",
  age: 24,
  email: "hello@marz.dev",
  github: "https://github.com/Marxz13",
  githubHandle: "@Marxz13",
  contributions: 6000,
  photo:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=1100&fit=crop&crop=faces&q=80",
  intro:
    "Friendly, introverted, and quietly relentless. I turn ambiguous ideas into shipped products — caring most about the details everyone else skips.",
  statement: "I build software that ships, scales & stays out of the way.",
};

export const NAV: NavLink[] = [
  { label: "about", href: "#about" },
  { label: "work", href: "#work" },
  { label: "stack", href: "#skills" },
  { label: "contact", href: "#contact" },
];

export const MARQUEE: string[] = [
  "FULLSTACK DEVELOPER",
  "SHIPS FAST",
  "DESIGN-MINDED",
  "RESULT-DRIVEN",
  "QUIETLY RELENTLESS",
];

export const PROJECTS: Project[] = [
  {
    index: "01",
    name: "Tokkae",
    description:
      "A Shopee-style multi-vendor marketplace built end-to-end across buyer & seller web, buyer & seller mobile apps, and an admin console — with real-time chat and a “One-Piece” recommendation feed.",
    tech: ["Next.js 16", "React 19", "Supabase", "Go", "WebSockets"],
    timeline: "2024 — EOY 2026",
    href: "https://tokkae.com",
  },
  {
    index: "02",
    name: "Zicy",
    description:
      "An AEO/GEO Chrome extension that audits how ready any page is to be cited by AI answer engines — ChatGPT, Perplexity, Gemini — with a side-panel AI consultant.",
    tech: ["Chrome MV3", "JavaScript", "Python", "LLMs"],
    metric: "454 live users worldwide",
    href: "https://chromewebstore.google.com/detail/zicy-%E2%80%93-aeogeo-audit-ai-co/bbgmbofeglplaaamnfgmiejbeacokfbn",
  },
  {
    index: "03",
    name: "Scale POS",
    description:
      "A native, offline-first iPad point-of-sale for multi-vendor retail — F&B and retail under one org-level, multi-store dashboard, with BLE receipt printing and barcode scanning.",
    tech: ["React Native", "Expo", "SQLite", "Convex"],
    timeline: "2025 — EOY 2027",
    href: "https://scalekh.com",
  },
  {
    index: "04",
    name: "Scale Inventory",
    description:
      "A Tauri + Rust desktop inventory system for F&B and retail — purchase orders, cycle counts, par-level reorder alerts, and recipe/BOM costing, synced offline-first to the Scale backend.",
    tech: ["Tauri", "Rust", "React", "TypeScript", "SQLite"],
    timeline: "2025 — EOY 2027",
    href: "https://scalekh.com",
  },
];

export const SKILLS: SkillGroup[] = [
  {
    label: "Frontend",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "GSAP", "Framer Motion"],
  },
  {
    label: "Backend",
    items: ["Node.js", "NestJS", "Go", "PostgreSQL", "Prisma", "GraphQL"],
  },
  {
    label: "Infra & Tools",
    items: ["Docker", "AWS", "Redis", "CI / CD", "Vercel", "Git"],
  },
];

export const EXPERIENCE: ExperienceEntry[] = [
  {
    period: "2024 — NOW",
    role: "Fullstack Developer · Independent",
    blurb:
      "Designing and shipping products end-to-end for founders and small teams — from schema to deploy.",
    current: true,
  },
  {
    period: "2022 — 2024",
    role: "Software Engineer · Product Studio",
    blurb:
      "Built core features across web apps and internal tooling; owned the frontend architecture and API layer.",
  },
  {
    period: "2021 — 2022",
    role: "Frontend Developer · Agency",
    blurb:
      "Crafted marketing sites and interactive experiences with a focus on motion and performance.",
  },
];
