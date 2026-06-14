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
      "A Shopee-style multi-vendor marketplace — buyer web + mobile, a rider/driver app, a seller console with KPIs, and real-time chat, all surfaced through a “One-Piece” recommendation feed.",
    tech: ["Next.js 16", "React 19", "Supabase", "Go", "WebSockets"],
    href: "#",
  },
  {
    index: "02",
    name: "Zicy",
    description:
      "An AEO/GEO Chrome extension that audits how ready any page is to be cited by AI answer engines — ChatGPT, Perplexity, Gemini — with a side-panel AI consultant.",
    tech: ["Chrome MV3", "JavaScript", "Python", "LLMs"],
    href: "https://www.zicy.com",
  },
  {
    index: "03",
    name: "Scale POS",
    description:
      "A multi-vendor POS & retail-ops platform — F&B and retail under one org-level, multi-store dashboard. Offline-first iPad POS plus a Tauri desktop suite on a Convex backend.",
    tech: ["Tauri", "Rust", "Expo", "Convex", "SQLite"],
    href: "#",
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
