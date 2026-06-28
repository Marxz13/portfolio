/* ───────────────────────────────────────────────────────────
   Portfolio content - single source of truth.
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
  /** WhatsApp number digits for the wa.me link (country code, no symbols). */
  whatsapp: string;
  /** Human-readable WhatsApp number shown on the button. */
  whatsappDisplay: string;
  location: string;
  /** Hiring status shown in the nav and hero, e.g. "Open to work". */
  status: string;
  /** One-line availability statement for the contact section. */
  availability: string;
  /** Path to the résumé PDF (served from public/). */
  cv: string;
  /** Annual GitHub contribution count shown in the stats band. */
  contributions: number;
  /** Portrait used by the pixelization canvas. Replace with your own. */
  photo: string;
  /** Alternate portrait (gorilla) the hero glitch-swaps to on first scroll. */
  photoAlt: string;
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

/* Architecture / communication diagram model (rendered by ArchitectureDiagram).
   Coordinates are in an abstract viewBox space; the SVG scales to fit. */
export interface ArchNode {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind?: "fe" | "be" | "data" | "auth" | "ext";
}
export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
  kind?: "rest" | "auth" | "realtime" | "bridge" | "data" | "ext";
  /** Perpendicular offset to separate parallel edges between the same two nodes. */
  offset?: number;
  /** Draw an arrowhead at both ends. */
  bidir?: boolean;
}
export interface ArchSpec {
  nodes: ArchNode[];
  edges: ArchEdge[];
  note?: string;
  aria?: string;
}

/* Algorithm showcase model (rendered by AlgorithmShowcase): an optional flow
   diagram (reuses ArchSpec) + weighted factors as bars + grouped detail lists. */
export interface AlgoFactor {
  label: string;
  weight: number;
}
export interface AlgoGroup {
  title: string;
  items: string[];
}
export type AlgoIcon = "buyer" | "search" | "click" | "signal" | "profile" | "feed";
export interface AlgoStep {
  icon: AlgoIcon;
  title: string;
  detail: string;
}
export interface AlgoFeedItem {
  name: string;
  /** Short chip, e.g. "Personal", "Deal", "New". */
  tag?: string;
  /** Why this item surfaced (ties back to a ranking factor). */
  reason: string;
  /** Highlight as a personalization win. */
  boosted?: boolean;
}
/* A concrete, illustrative walkthrough (not real data) of the algorithm in action. */
export interface AlgoExample {
  persona: string;
  steps: AlgoStep[];
  feedTitle: string;
  feed: AlgoFeedItem[];
}
export interface AlgoSpec {
  title: string;
  summary: string;
  flow?: ArchSpec;
  factors?: { title: string; items: AlgoFactor[] };
  groups?: AlgoGroup[];
  example?: AlgoExample;
  note?: string;
}

export interface Project {
  index: string;        // "01"
  name: string;
  description: string;
  tech: string[];
  /** Optional traction/highlight shown on the card, e.g. "454 live users worldwide". */
  metric?: string;
  /** Optional build timeline, e.g. "2024 - EOY 2026". */
  timeline?: string;
  /** Optional screenshot revealed beside the card on hover (path under public/). */
  screenshot?: string;
  /** Call-to-action label shown when hovering the screenshot. */
  screenshotCta?: string;
  /** Optional multi-panel preview revealed beside the card; click to expand. */
  panels?: ProjectPanel[];
  /** Optional architecture/communication diagram shown via a detail-view toggle. */
  architecture?: ArchSpec;
  /** Optional signature-algorithm showcase shown via a detail-view toggle. */
  algorithm?: AlgoSpec;
  href: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface ExperienceEntry {
  period: string;       // "2024 - NOW"
  role: string;
  blurb: string;
  /** Optional company/site URL (domain only) shown as a link subcard. */
  link?: string;
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
  whatsapp: "601111433952",
  whatsappDisplay: "+60 11-1143 3952",
  location: "Kuala Lumpur, MY",
  status: "Open to work",
  availability:
    "Full-time Full-Stack & Software Engineering roles - Kuala Lumpur or remote.",
  cv: "/Mar_Zallan_Resume.pdf",
  contributions: 6000,
  photo: "/marz_human.png",
  photoAlt: "/marz_gorilla.png",
  intro:
    "Full-stack engineer shipping enterprise apps, SaaS platforms, and AI-native tools end to end - React/TypeScript on the front, Python & Node.js on the back, AWS underneath. I own products from architecture through CI/CD to production.",
  statement: "I build software that ships, scales & stays out of the way.",
};

export const NAV: NavLink[] = [
  { label: "about", href: "#about" },
  { label: "work", href: "#work" },
  { label: "contact", href: "#contact" },
];

export const MARQUEE: string[] = [
  "FULL-STACK ENGINEER",
  "SHIPS END-TO-END",
  "AI-NATIVE TOOLING",
  "ENTERPRISE & SAAS",
  "REACT · PYTHON · AWS",
];

/* Source-verified from the Tokkae repos: 3 frontends, a NestJS monolith + a Go
   chat service, with a deliberately split auth (web=Supabase, mobile=backend OTP)
   and split realtime (web->Go native WS, mobile->NestJS socket.io). */
const TOKKAE_ARCHITECTURE: ArchSpec = {
  aria:
    "Tokkae system architecture: a web app and a mobile app talking to a NestJS API and a Go chat service over REST, WebSocket and socket.io, backed by PostgreSQL, Redis, search and NATS.",
  note:
    "Web signs in through Supabase; mobile authenticates via backend OTP/Telegram (no Supabase). All services verify JWTs against Supabase JWKS.",
  nodes: [
    { id: "web", label: "Web", sub: "Buyer + Seller · Next.js", x: 20, y: 70, w: 150, h: 56, kind: "fe" },
    { id: "mobile", label: "Mobile", sub: "Expo · React Native", x: 20, y: 210, w: 150, h: 56, kind: "fe" },
    { id: "supa", label: "Supabase Auth", sub: "OAuth · JWT (JWKS)", x: 360, y: 10, w: 180, h: 50, kind: "auth" },
    { id: "api", label: "Tokkae API", sub: "NestJS monolith + Worker", x: 360, y: 110, w: 180, h: 96, kind: "be" },
    { id: "chat", label: "Chat API", sub: "Go · Fiber", x: 360, y: 300, w: 180, h: 64, kind: "be" },
    { id: "pg", label: "PostgreSQL", sub: "ecom", x: 640, y: 40, w: 160, h: 48, kind: "data" },
    { id: "redis", label: "Redis", sub: "cache · queues · pub/sub", x: 640, y: 110, w: 160, h: 48, kind: "data" },
    { id: "search", label: "Search", sub: "Elastic / Meili", x: 640, y: 180, w: 160, h: 48, kind: "data" },
    { id: "pgchat", label: "PostgreSQL", sub: "chat_db", x: 640, y: 300, w: 160, h: 48, kind: "data" },
    { id: "nats", label: "NATS", sub: "JetStream", x: 640, y: 370, w: 160, h: 48, kind: "data" },
    {
      id: "ext",
      label: "External integrations",
      sub: "ML · LLM · Twilio · payments · Maps · S3 · UploadThing",
      x: 20,
      y: 440,
      w: 520,
      h: 54,
      kind: "ext",
    },
  ],
  edges: [
    { from: "web", to: "api", label: "REST /api/v1", kind: "rest" },
    { from: "mobile", to: "api", label: "REST", kind: "rest", offset: 10 },
    { from: "mobile", to: "api", label: "socket.io /chat", kind: "realtime", offset: -10 },
    { from: "web", to: "supa", label: "JWT", kind: "auth" },
    { from: "web", to: "chat", label: "WebSocket", kind: "realtime" },
    { from: "api", to: "chat", label: "REST + HMAC", kind: "bridge", bidir: true },
    { from: "api", to: "pg", label: "TypeORM", kind: "data" },
    { from: "api", to: "redis", label: "BullMQ", kind: "data" },
    { from: "api", to: "search", label: "index", kind: "data" },
    { from: "chat", to: "pgchat", label: "pgx", kind: "data" },
    { from: "chat", to: "nats", label: "publish", kind: "data" },
    { from: "api", to: "ext", label: "REST", kind: "ext" },
  ],
};

/* Source-verified from tokkae-tools (NestJS homepage / analytics / user-profiling
   modules): the personalized "For You" feed is a 3-stage cascade - Candidate
   Retrieval -> Scoring (8-factor weighted) -> Re-rank - with an async feedback
   loop (clicks -> affinities -> cron similarity -> LLM profiling). An optional
   LightGBM ranker is wired but off by default, so the rule-based score is live. */
const TOKKAE_ALGORITHM: AlgoSpec = {
  title: "Personalized “For You” Feed",
  summary:
    "A 3-stage recommendation cascade (Retrieve → Rank → Re-rank) served from /homepage/products, personalized per user and continuously tuned by an async feedback loop.",
  flow: {
    aria:
      "Tokkae recommendation pipeline: request to candidate retrieval to scoring to re-rank to response, with an async feedback loop through aggregation and LLM profiling.",
    nodes: [
      { id: "req", label: "Request", sub: "/homepage/products", x: 20, y: 50, w: 150, h: 64, kind: "fe" },
      { id: "cand", label: "Candidate Retrieval", sub: "multi-source → 200", x: 200, y: 50, w: 150, h: 64, kind: "be" },
      { id: "score", label: "Scoring", sub: "8-factor weighted", x: 380, y: 50, w: 150, h: 64, kind: "be" },
      { id: "rerank", label: "Re-rank", sub: "diversity + boosts", x: 560, y: 50, w: 150, h: 64, kind: "be" },
      { id: "resp", label: "Response", sub: "paginate + cache", x: 740, y: 50, w: 150, h: 64, kind: "fe" },
      { id: "feedback", label: "Feedback", sub: "clicks / impressions", x: 200, y: 220, w: 150, h: 58, kind: "data" },
      { id: "agg", label: "Aggregation", sub: "stats · similarity", x: 380, y: 220, w: 150, h: 58, kind: "data" },
      { id: "prof", label: "LLM Profiling", sub: "shopper boosts", x: 560, y: 220, w: 150, h: 58, kind: "ext" },
    ],
    edges: [
      { from: "req", to: "cand", label: "request", kind: "rest" },
      { from: "cand", to: "score", label: "≤200", kind: "rest" },
      { from: "score", to: "rerank", label: "scored", kind: "rest" },
      { from: "rerank", to: "resp", label: "top 100", kind: "rest" },
      { from: "resp", to: "feedback", label: "interactions", kind: "ext" },
      { from: "feedback", to: "agg", label: "events", kind: "ext" },
      { from: "agg", to: "prof", label: "signals", kind: "ext" },
      { from: "prof", to: "score", label: "boosts", kind: "ext" },
      { from: "agg", to: "cand", label: "trending / similarity", kind: "ext" },
    ],
  },
  factors: {
    title: "Ranking score — 8 weighted factors",
    items: [
      { label: "Personal", weight: 0.22 },
      { label: "Clicks (24h)", weight: 0.2 },
      { label: "Sales", weight: 0.18 },
      { label: "Rating", weight: 0.15 },
      { label: "Seller quality", weight: 0.1 },
      { label: "Freshness", weight: 0.08 },
      { label: "CTR", weight: 0.04 },
      { label: "Price/discount", weight: 0.03 },
    ],
  },
  groups: [
    {
      title: "Candidate sources",
      items: [
        "Trending (24h clicks)",
        "Best sellers (soldCount)",
        "New arrivals",
        "Top rated (Bayesian)",
        "Category affinity",
        "Similar-to-viewed",
        "Collaborative (co-buy / co-view)",
        "Search history (Elasticsearch)",
        "LLM-inferred categories",
      ],
    },
    {
      title: "Signals",
      items: [
        "product_clicks → CTR, dwell, trending",
        "Category/brand affinity (30-day half-life, tree-propagated)",
        "Price-range fit",
        "Recent views & searches",
        "product_similarities (content + collaborative)",
        "LLM shopper profile (keyword/category boosts)",
      ],
    },
    {
      title: "Re-rank rules",
      items: [
        "Max 4 per category",
        "Max 3 per seller",
        "Completeness boost (images/reviews)",
        "New-listing boost (≤7d)",
        "Discount boost",
        "Top-8 category variety",
      ],
    },
  ],
  example: {
    persona: "Buyer — Dara’s first session",
    steps: [
      { icon: "search", title: "Searches “running shoes”", detail: "Opens 3 sportswear products, lingers on a $45 trainer." },
      { icon: "click", title: "Clicks captured", detail: "product_clicks logs source, dwell time & the items viewed." },
      { icon: "signal", title: "Signals update", detail: "Sportswear affinity ↑, price-range ≈ $40, co-viewed items linked." },
      { icon: "profile", title: "Profile inferred", detail: "Cron + LLM tag Dara “deal-hunter · sportswear” → category/keyword boosts." },
      { icon: "feed", title: "Feed re-ranks", detail: "Next /homepage/products visit is reordered for Dara." },
    ],
    feedTitle: "Dara’s “For You” feed, re-ranked",
    feed: [
      { name: "Trail Runner Pro", tag: "Personal", reason: "category affinity (+0.22)", boosted: true },
      { name: "Trainers −30%", tag: "Deal", reason: "deal-hunter + discount boost", boosted: true },
      { name: "Sports Socks 3-pk", tag: "Co-view", reason: "bought-together similarity" },
      { name: "Runner X (new)", tag: "New", reason: "freshness boost (≤7d)" },
      { name: "Gym Tee", reason: "brand affinity" },
      { name: "Yoga Mat", reason: "category-variety cap keeps it diverse" },
    ],
  },
  note:
    "Rule-based 3-stage cascade; an optional LightGBM ranker is wired but off by default, so the 8-factor weighted score above is live. Affinities decay on a 30-day half-life with category-tree propagation; anonymous / new users get a randomized Discovery mix. The walkthrough above is illustrative. Source: tokkae-tools NestJS homepage / analytics / user-profiling modules.",
};

/* Source-verified from the Zicy repos: a Chrome extension + a React admin talking
   to two FastAPI services and a separate scoring/agent API. The extension scrapes
   pages and sends HTML to the scoring backend - it never calls AI answer engines
   directly; the only LLM call runs inside the backends. */
const ZICY_ARCHITECTURE: ArchSpec = {
  aria:
    "Zicy architecture: a Chrome extension and a React admin dashboard talking to two FastAPI backends and a separate scoring/agent API, backed by MongoDB, ChromaDB and S3, with an LLM, Stripe and Firebase Auth.",
  note:
    "The extension scrapes the page and sends HTML to the scoring backend - it never calls AI answer engines directly; the only LLM call runs inside the backends. ChromaDB is a semantic response cache. * the Agent API is a separate service (source not inspected). Backends verify Firebase ID tokens.",
  nodes: [
    { id: "ext", label: "Chrome Extension", sub: "MV3 · side panel", x: 20, y: 90, w: 160, h: 64, kind: "fe" },
    { id: "admin", label: "Admin Dashboard", sub: "React · Vite", x: 20, y: 240, w: 160, h: 64, kind: "fe" },
    { id: "firebase", label: "Firebase Auth", sub: "ID tokens", x: 280, y: 10, w: 170, h: 46, kind: "auth" },
    { id: "tools", label: "Agent API", sub: "scoring · schema *", x: 280, y: 80, w: 170, h: 62, kind: "be" },
    { id: "chatbot", label: "zicy-chatbot", sub: "FastAPI · SSE", x: 280, y: 190, w: 170, h: 62, kind: "be" },
    { id: "adminbe", label: "zicy-admin", sub: "FastAPI", x: 280, y: 300, w: 170, h: 62, kind: "be" },
    { id: "openai", label: "LLM", sub: "chat / audit", x: 560, y: 60, w: 160, h: 46, kind: "ext" },
    { id: "mongo", label: "MongoDB", x: 560, y: 130, w: 160, h: 46, kind: "data" },
    { id: "chroma", label: "ChromaDB", sub: "semantic cache", x: 560, y: 200, w: 160, h: 46, kind: "data" },
    { id: "aws", label: "AWS S3", x: 560, y: 270, w: 160, h: 46, kind: "data" },
    { id: "stripe", label: "Stripe", x: 560, y: 340, w: 160, h: 46, kind: "ext" },
  ],
  edges: [
    { from: "ext", to: "tools", label: "audit / schema", kind: "rest" },
    { from: "ext", to: "chatbot", label: "SSE chat", kind: "realtime" },
    { from: "admin", to: "adminbe", label: "REST + token", kind: "rest" },
    { from: "admin", to: "firebase", label: "Firebase login", kind: "auth" },
    { from: "chatbot", to: "tools", label: "agent jobs (wss)", kind: "bridge" },
    { from: "chatbot", to: "openai", label: "LLM", kind: "ext" },
    { from: "chatbot", to: "mongo", label: "sessions", kind: "data" },
    { from: "chatbot", to: "chroma", label: "cache", kind: "data" },
    { from: "chatbot", to: "aws", label: "S3", kind: "data" },
    { from: "adminbe", to: "mongo", label: "Motor", kind: "data" },
    { from: "adminbe", to: "stripe", label: "billing", kind: "ext" },
  ],
};

/* Source-verified from the Scale Inventory repos: a Tauri 2 desktop app whose
   React webview talks to a Rust core over in-process IPC; the Rust core owns the
   offline SQLite store (dirty-row outbox) and syncs to a Hono backend over HTTPS. */
const SCALE_INVENTORY_ARCHITECTURE: ArchSpec = {
  aria:
    "Scale Inventory architecture: a Tauri desktop app whose React webview calls a Rust core over IPC; the Rust core owns an offline SQLite store and syncs to a Hono backend over HTTPS, backed by Supabase Postgres.",
  note:
    "UI↔core calls are in-process Tauri IPC. The Rust core owns the offline SQLite store (dirty-row outbox) and syncs to the Hono backend via reqwest (pull-then-push). Staff JWT lives in the OS keyring; reorder alerts are computed client-side. Recipe/BOM costing is planned, not yet built.",
  nodes: [
    { id: "ui", label: "Webview UI", sub: "React/TS · Zustand", x: 20, y: 110, w: 170, h: 70, kind: "fe" },
    { id: "rust", label: "Rust Core", sub: "src-tauri · sync worker", x: 270, y: 95, w: 180, h: 96, kind: "be" },
    { id: "sqlite", label: "SQLite (local)", sub: "offline · dirty outbox", x: 270, y: 250, w: 180, h: 54, kind: "data" },
    { id: "keyring", label: "Keyring", sub: "staff JWT (OS)", x: 40, y: 250, w: 160, h: 54, kind: "ext" },
    { id: "hono", label: "Hono", sub: "Node 22 · inv-changes", x: 560, y: 95, w: 160, h: 70, kind: "be" },
    { id: "auth", label: "Auth backend", sub: "OTP · switch store", x: 560, y: 250, w: 160, h: 54, kind: "auth" },
    { id: "pg", label: "PostgreSQL", sub: "Supabase · inv_* · RLS", x: 770, y: 100, w: 160, h: 70, kind: "data" },
  ],
  edges: [
    { from: "ui", to: "rust", label: "Tauri IPC", kind: "rest", bidir: true },
    { from: "rust", to: "sqlite", label: "rusqlite (offline)", kind: "data" },
    { from: "rust", to: "keyring", label: "keyring", kind: "ext" },
    { from: "rust", to: "hono", label: "reqwest /inv-changes", kind: "bridge", bidir: true },
    { from: "rust", to: "auth", label: "OTP / switch store", kind: "auth" },
    { from: "hono", to: "pg", label: "supabase-js", kind: "data" },
  ],
};

/* Source-verified from the Scale POS repos: an Expo iPad app that is offline-first
   (local SQLite + mutation outbox) and talks to a backend shipped as interchangeable
   Supabase Edge Functions (Deno) or a Hono Node server. Hardware is device-local. */
const SCALE_POS_ARCHITECTURE: ArchSpec = {
  aria:
    "Scale POS architecture: an Expo iPad app with a local SQLite store and mutation outbox, talking to a backend of Supabase Edge Functions or a Hono server, backed by Supabase Postgres and GoTrue, with BLE printing and barcode scanning device-local.",
  note:
    "Offline-first: the app reads/writes a local SQLite store with a mutation outbox; the sales sync loop is built client-side but its endpoints are still backend-pending (auth + inventory are live). The backend ships as interchangeable Supabase Edge Functions (Deno) or a Hono Node server with identical /functions/v1 routes. BLE printing and barcode scanning are device-local.",
  nodes: [
    { id: "sqlite", label: "SQLite", sub: "offline · outbox", x: 20, y: 60, w: 150, h: 54, kind: "data" },
    { id: "secure", label: "Secure Store", sub: "tokens", x: 20, y: 134, w: 150, h: 46, kind: "ext" },
    { id: "printer", label: "BLE Printer", sub: "ESC/POS", x: 20, y: 200, w: 150, h: 46, kind: "ext" },
    { id: "scanner", label: "Scanner", sub: "camera / HID", x: 20, y: 266, w: 150, h: 46, kind: "ext" },
    { id: "pos", label: "Scale POS App", sub: "Expo · ApiClient + Sync runner", x: 230, y: 120, w: 180, h: 120, kind: "fe" },
    { id: "api", label: "Backend API", sub: "Edge Functions / Hono", x: 480, y: 110, w: 180, h: 96, kind: "be" },
    { id: "pg", label: "Supabase Postgres", sub: "orgs · stores · staff", x: 730, y: 60, w: 160, h: 62, kind: "data" },
    { id: "gotrue", label: "Supabase GoTrue", sub: "auth", x: 730, y: 150, w: 160, h: 54, kind: "auth" },
    { id: "sms", label: "SMS provider", sub: "OTP", x: 730, y: 230, w: 160, h: 46, kind: "ext" },
  ],
  edges: [
    { from: "pos", to: "sqlite", label: "expo-sqlite (offline)", kind: "data", bidir: true },
    { from: "pos", to: "secure", label: "secure-store", kind: "ext" },
    { from: "pos", to: "printer", label: "BLE · ESC/POS", kind: "ext" },
    { from: "pos", to: "scanner", label: "camera / HID", kind: "ext", bidir: true },
    { from: "pos", to: "api", label: "REST auth-* (Bearer JWT)", kind: "rest", offset: -12 },
    { from: "pos", to: "api", label: "sync (planned)", kind: "ext", offset: 14 },
    { from: "api", to: "pg", label: "service-role", kind: "data" },
    { from: "api", to: "gotrue", label: "GoTrue signIn", kind: "auth" },
    { from: "gotrue", to: "sms", label: "OTP SMS", kind: "ext" },
  ],
};

export const PROJECTS: Project[] = [
  {
    index: "01",
    name: "Tokkae",
    description:
      "A Shopee-style multi-vendor marketplace built end-to-end across buyer & seller web, buyer & seller mobile apps, and an admin console - with real-time chat and a “One-Piece” recommendation feed.",
    tech: ["Next.js", "React 19", "TypeScript", "NestJS", "Go", "Supabase", "WebSockets", "React Native"],
    timeline: "2024 - EOY 2026",
    panels: [
      { label: "Buyer Site", image: "/tokkae-buyer-site.png" },
      { label: "Seller Site", image: "/tokkae-seller-site.png" },
      { label: "Admin Site", image: "/tokkae-admin-site.png" },
      { label: "Mobile View", image: "/tokkae-mobile.png" },
    ],
    architecture: TOKKAE_ARCHITECTURE,
    algorithm: TOKKAE_ALGORITHM,
    href: "https://tokkae.com",
  },
  {
    index: "02",
    name: "Zicy",
    description:
      "An AEO/GEO Chrome extension that audits how ready any page is to be cited by AI answer engines - ChatGPT, Perplexity, Gemini - with a side-panel AI consultant.",
    tech: ["Chrome MV3", "React", "TypeScript", "FastAPI", "LLM", "MongoDB", "ChromaDB", "AWS"],
    metric: "454 live users worldwide",
    screenshot: "/zicy-chromeex.png",
    screenshotCta: "Go to Chrome Extension",
    architecture: ZICY_ARCHITECTURE,
    href: "https://chromewebstore.google.com/detail/zicy-%E2%80%93-aeogeo-audit-ai-co/bbgmbofeglplaaamnfgmiejbeacokfbn",
  },
  {
    index: "03",
    name: "Scale POS",
    description:
      "A native, offline-first iPad point-of-sale for multi-vendor retail - F&B and retail under one org-level, multi-store dashboard, with BLE receipt printing and barcode scanning.",
    tech: ["React Native", "Expo", "TypeScript", "SQLite", "Supabase", "Hono", "BLE Printing", "Barcode Scanning"],
    timeline: "2025 - EOY 2027",
    panels: [
      { label: "POS Terminal" },
      { label: "Dashboard" },
    ],
    architecture: SCALE_POS_ARCHITECTURE,
    href: "https://scalekh.com",
  },
  {
    index: "04",
    name: "Scale Inventory",
    description:
      "A Tauri + Rust desktop inventory system for F&B and retail - purchase orders, cycle counts, par-level reorder alerts, and recipe/BOM costing, synced offline-first to the Scale backend.",
    tech: ["Tauri", "Rust", "React", "TypeScript", "SQLite", "Supabase", "Hono"],
    timeline: "2025 - EOY 2027",
    panels: [
      { label: "Desktop App", image: "/scale-inventory.png" },
    ],
    architecture: SCALE_INVENTORY_ARCHITECTURE,
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
    period: "2025 - NOW",
    role: "Software Engineer · Zicy",
    blurb:
      "Own core SaaS modules - Content Optimizer, billing/quota, admin, and the Chrome plugin - end to end, from REST API design to React dashboards to AWS production ops (EC2, GitHub Actions, Celery, Nginx). Shipped Stripe billing and AEO/GEO features for 15+ enterprise beta clients.",
    link: "zicy.com",
    current: true,
  },
  {
    period: "2024 - 2025",
    role: "Junior Data Engineer · Growth.Pro",
    blurb:
      "Built an XGBoost property-price model (89% R²) over 15,000+ records, plus a production Flask REST API with PyTest coverage and automated data pipelines that cut manual processing 60%.",
    link: "growthpro.asia",
  },
  {
    period: "2023 - 2024",
    role: "Full-Stack Developer · Fuji Elevator",
    blurb:
      "Worked with Fuji Elevator (alongside their team) to help build an entire running system: a 32-page enterprise ERP for elevator operations, with a React 18 + TypeScript front end and role-based access (8 roles, 80+ permissions) over a FastAPI back end with 100+ endpoints, WebSocket notifications, and automated document generation.",
    link: "fujielevator.com.kh",
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    period: "2022 - 2025",
    school: "University of Nottingham Malaysia",
    detail: "B.Sc. Computer Science - Second Class Honours, Upper Division (2:1)",
    location: "Semenyih, MY",
  },
];
