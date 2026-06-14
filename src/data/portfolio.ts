/* ───────────────────────────────────────────────────────────
   Portfolio content — single source of truth.
   Swap these values for the real ones; the components are
   purely presentational and read everything from here.
   ─────────────────────────────────────────────────────────── */

export interface Profile {
  name: string;
  /** Full name used in the footer / formal contexts. */
  fullName: string;
  role: string;
  age: number;
  email: string;
  github: string;
  githubHandle: string;
  linkedin: string;
  location: string;
  /** Path to the résumé PDF (served from public/). */
  cv: string;
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

export interface ProjectPanel {
  label: string;
  /** Optional screenshot; a labeled placeholder is shown until one is provided. */
  image?: string;
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
  /** Optional screenshot revealed beside the card on hover (path under public/). */
  screenshot?: string;
  /** Call-to-action label shown when hovering the screenshot. */
  screenshotCta?: string;
  /** Optional multi-panel preview revealed beside the card; click to expand. */
  panels?: ProjectPanel[];
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

export interface EducationEntry {
  period: string;
  school: string;
  detail: string;
  location?: string;
}

export const PROFILE: Profile = {
  name: "MARZ",
  fullName: "Mar Zallan Ismail",
  role: "Full-Stack Engineer",
  age: 24,
  email: "marzallan13@gmail.com",
  github: "https://github.com/Marxz13",
  githubHandle: "@Marxz13",
  linkedin: "https://linkedin.com/in/marzallan",
  location: "Kuala Lumpur, MY",
  cv: "/Mar_Zallan_Resume.pdf",
  contributions: 6000,
  photo:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=1100&fit=crop&crop=faces&q=80",
  intro:
    "Full-stack engineer shipping enterprise apps, SaaS platforms, and AI-native tools end to end — React/TypeScript on the front, Python & Node.js on the back, AWS underneath. I own products from architecture through CI/CD to production.",
  statement: "I build software that ships, scales & stays out of the way.",
};

export const NAV: NavLink[] = [
  { label: "about", href: "#about" },
  { label: "work", href: "#work" },
  { label: "stack", href: "#skills" },
  { label: "contact", href: "#contact" },
];

export const MARQUEE: string[] = [
  "FULL-STACK ENGINEER",
  "SHIPS END-TO-END",
  "AI-NATIVE TOOLING",
  "ENTERPRISE & SAAS",
  "REACT · PYTHON · AWS",
];

export const PROJECTS: Project[] = [
  {
    index: "01",
    name: "Tokkae",
    description:
      "A Shopee-style multi-vendor marketplace built end-to-end across buyer & seller web, buyer & seller mobile apps, and an admin console — with real-time chat and a “One-Piece” recommendation feed.",
    tech: ["Next.js 16", "React 19", "Supabase", "Go", "WebSockets"],
    timeline: "2024 — EOY 2026",
    panels: [
      { label: "Buyer Site" },
      { label: "Seller Site" },
      { label: "Admin Site" },
      { label: "Mobile View" },
    ],
    href: "https://tokkae.com",
  },
  {
    index: "02",
    name: "Zicy",
    description:
      "An AEO/GEO Chrome extension that audits how ready any page is to be cited by AI answer engines — ChatGPT, Perplexity, Gemini — with a side-panel AI consultant.",
    tech: ["Chrome MV3", "JavaScript", "Python", "LLMs"],
    metric: "454 live users worldwide",
    screenshot: "/zicy-chromeex.png",
    screenshotCta: "Go to Chrome Extension",
    href: "https://chromewebstore.google.com/detail/zicy-%E2%80%93-aeogeo-audit-ai-co/bbgmbofeglplaaamnfgmiejbeacokfbn",
  },
  {
    index: "03",
    name: "Scale POS",
    description:
      "A native, offline-first iPad point-of-sale for multi-vendor retail — F&B and retail under one org-level, multi-store dashboard, with BLE receipt printing and barcode scanning.",
    tech: ["React Native", "Expo", "SQLite", "Convex"],
    timeline: "2025 — EOY 2027",
    panels: [
      { label: "POS Terminal" },
      { label: "Dashboard" },
    ],
    href: "https://scalekh.com",
  },
  {
    index: "04",
    name: "Scale Inventory",
    description:
      "A Tauri + Rust desktop inventory system for F&B and retail — purchase orders, cycle counts, par-level reorder alerts, and recipe/BOM costing, synced offline-first to the Scale backend.",
    tech: ["Tauri", "Rust", "React", "TypeScript", "SQLite"],
    timeline: "2025 — EOY 2027",
    panels: [
      { label: "Desktop App" },
    ],
    href: "https://scalekh.com",
  },
];

export const SKILLS: SkillGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Go", "SQL", "Bash"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "React Native", "Tailwind CSS", "shadcn/ui", "Vite"],
  },
  {
    label: "Backend",
    items: ["Node.js", "FastAPI", "Flask", "REST APIs", "WebSockets", "Celery / Kafka"],
  },
  {
    label: "Data & Cloud",
    items: ["PostgreSQL", "MongoDB", "Redis", "AWS (EC2)", "Docker", "GitHub Actions"],
  },
];

export const EXPERIENCE: ExperienceEntry[] = [
  {
    period: "2025 — NOW",
    role: "Software Engineer · Zicy",
    blurb:
      "Own core SaaS modules — Content Optimizer, billing/quota, admin, and the Chrome plugin — end to end, from REST API design to React dashboards to AWS production ops (EC2, GitHub Actions, Celery, Nginx). Shipped Stripe billing and AEO/GEO features for 15+ enterprise beta clients.",
    current: true,
  },
  {
    period: "2024 — 2025",
    role: "Junior Data Engineer · Growth.Pro",
    blurb:
      "Built an XGBoost property-price model (89% R²) over 15,000+ records, plus a production Flask REST API with PyTest coverage and automated data pipelines that cut manual processing 60%.",
  },
  {
    period: "2023 — 2024",
    role: "Full-Stack Developer · Fuji Elevator",
    blurb:
      "Architected a 32-page enterprise ERP for elevator operations: a React 18 + TypeScript front end with role-based access (8 roles, 80+ permissions) over a FastAPI back end with 100+ endpoints, WebSocket notifications, and automated document generation.",
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    period: "2022 — 2025",
    school: "University of Nottingham Malaysia",
    detail: "B.Sc. Computer Science — Second Class Honours, Upper Division (2:1)",
    location: "Semenyih, MY",
  },
];
