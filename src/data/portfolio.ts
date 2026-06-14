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
  year: string;
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
    name: "Atlas",
    description:
      "A realtime analytics platform — event pipeline, query engine, and dashboards used across the org.",
    tech: ["Next.js", "tRPC", "PostgreSQL", "Redis"],
    year: "2025",
    href: "#",
  },
  {
    index: "02",
    name: "Ferro",
    description:
      "Collaborative design-to-code tooling with live multiplayer editing and an instant preview engine.",
    tech: ["React", "Node.js", "WebSockets", "Docker"],
    year: "2024",
    href: "#",
  },
  {
    index: "03",
    name: "Mono",
    description:
      "A minimalist personal finance tracker — local-first, encrypted, and fast enough to feel native.",
    tech: ["SvelteKit", "Go", "SQLite"],
    year: "2024",
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
