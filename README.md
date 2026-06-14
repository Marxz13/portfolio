# Marz — Developer Portfolio (TSX)

> A single-page, pixelated Swiss-grid portfolio. Built with **Vite + React 18 + TypeScript + GSAP**.

## Quick start

```bash
npm install
npm run dev        # start the dev server (opens the browser)
npm run build      # type-check (tsc -b) + production build to dist/
npm run preview    # serve the production build locally
npm run lint       # ESLint (flat config)
```

Requires Node 20.19+ or 22.12+. The app entry is `src/main.tsx` → `src/App.tsx` → `src/Portfolio.tsx`.
All content lives in **`src/data/portfolio.ts`** — edit that to change copy, projects, skills, etc.

Fonts (Pixelify Sans / Space Grotesk / Space Mono) are loaded via `<link>` in `index.html`
(moved out of the CSS `@import` for performance). The design tokens and keyframes live in
`src/styles/portfolio.css`, scoped under the `.portfolio` root class.

> **Security note:** `npm audit` reports a high-severity advisory in `esbuild` (pulled in
> transitively by `vite`). It affects the dev/build toolchain only — not the shipped static
> bundle — and the only published fix is a breaking Vite major. Left on Vite 6 intentionally;
> revisit when Vite ships a patch on the current major.

---

# Handoff notes (original design brief)

## Overview
A single-page personal portfolio for **Marz**, a 24-year-old fullstack developer. Clean, technical, Swiss-grid aesthetic built around a **"pixelated" brand**: a pixel display typeface, a faint pixel-grid background, sharp 90° corners, and a hero portrait that **de-pixelates on load** (and re-shimmers on hover). The layout is intentionally **layered/overlapping** — the giant wordmark crosses the portrait, oversized section numerals bleed off the edges, and the Work cards stack in a diagonal offset.

## About the Design Files
This bundle ships **production-ready React + TypeScript components** that implement the design, **plus** the original HTML prototype as a visual reference (`reference/`). The prototype was authored in a streaming-HTML design tool and is **not** meant to run standalone — treat it as the source of truth for look & motion, and use the `.tsx`/`.ts`/`.css` files as the actual implementation to drop into your codebase.

If your app already has a design system, reconcile the tokens in `src/styles/portfolio.css` with your own (colors, type scale, spacing) rather than introducing duplicates. Everything here is scoped under a single `.portfolio` root class so it won't leak into the rest of the app.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, motion, and interactions. Recreate pixel-for-pixel; the provided components already are that recreation.

## Tech & Dependencies
- **React 18+**, **TypeScript**
- **GSAP 3** (`gsap`) — entrance timeline, scroll reveals, the stepped pixel de-resolve. Uses the `ScrollTrigger` plugin.
- Fonts: **Pixelify Sans** (display/wordmark), **Space Grotesk** (UI/body), **Space Mono** (labels) — Google Fonts.
- No UI/CSS framework required. Styling is inline `React.CSSProperties` reading CSS custom properties defined in `portfolio.css`. (If you prefer Tailwind, the tokens map cleanly to a theme extension — see Design Tokens.)

```bash
npm i gsap
```

### Next.js (App Router) note
`Portfolio.tsx` and `PixelPortrait.tsx` are Client Components (`"use client"`) — they use refs, canvas, and GSAP. Import `Portfolio` into a page and render it. Move the Google Fonts `@import` in `portfolio.css` to a `<link>` in your root layout for better performance (or use `next/font`).

## File Structure
```
src/
  Portfolio.tsx                 # main composition + GSAP orchestration
  components/
    PixelPortrait.tsx           # canvas pixelization (load reveal + hover shimmer)
    Marquee.tsx                 # full-bleed infinite ticker
    ContributionGraph.tsx       # GitHub-style heatmap (deterministic, SSR-safe)
  data/
    portfolio.ts                # ALL content + TypeScript types (edit me)
  styles/
    portfolio.css               # tokens, fonts, keyframes, hover states
reference/
  Marz Portfolio v2.dc.html     # original prototype (visual reference only)
```

Usage:
```tsx
import Portfolio from "./src/Portfolio";

export default function Page() {
  return <Portfolio />;
}
```

All copy, projects, skills, experience, links and the portrait URL live in **`src/data/portfolio.ts`** — swap those, the components are purely presentational.

## Screens / Views
One continuous scroll page. Max content width **1280px**, centered, side padding `clamp(20px,5vw,64px)`. Sections separated by a 1px ink top border; alternating sections use the `--bg-2` (`#F3F4F6`) fill.

### 1. Nav (sticky)
- Sticky top, `z-index:40`, translucent white `rgba(255,255,255,0.82)` + `backdrop-filter: blur(10px)`, 1px bottom border.
- Left: 10px accent square + `MARZ` wordmark (Pixelify Sans 600, 22px, letter-spacing 0.04em).
- Right: mono links (`about / work / stack / contact`, Space Mono 12px, `--muted` → `--ink` on hover) + an "available" status with an 8px accent square.

### 2. Hero
- Two-column grid: `minmax(0,420px) 1fr`, `gap: clamp(24px,5vw,60px)`, vertically centered, `min-height: min(80vh,740px)`.
- **Portrait (left):** `PixelPortrait`, 4:5 aspect, 1px ink border, `--bg-2` backing. 16px accent square pinned to top-left corner (offset −6px). Canvas filter `grayscale(1) contrast(1.06)`. Mono caption row below: `marz.png` / `[ pixel-rendered ]`.
- **Intro (right), z-index 2:**
  - Eyebrow: 7px accent square + `Fullstack Developer / 24` (Space Mono 12px, uppercase, `--muted`).
  - **Wordmark** `MARZ`: Pixelify Sans 700, `clamp(4rem,12.5vw,9.5rem)`, line-height 0.82. Pulled left with `margin-left: clamp(-210px,-16vw,-70px)` so it **overlaps the portrait's right edge**. Behind it sits a **registration echo** — an identical span, color `rgba(31,70,255,0.22)`, `transform: translate(11px,11px)`, `z-index:0`.
  - Statement (Space Grotesk 500, `clamp(1.2rem,2.3vw,1.85rem)`, max-width 22ch).
  - Intro paragraph (`--muted`, max-width 46ch).
  - Actions: **View work** (dark button), **Download CV** (ghost button), and a mono stat (`6,000 commits / this year`) divided by a 1px rule.
- Two scattered decorative squares (16px accent top-right, 11px ink bottom-left).

### 3. Marquee
- Full-bleed black band (`--ink` bg, `--bg` text), 1px ink top/bottom borders, 13px vertical padding.
- Pixelify Sans 600, `clamp(1.1rem,1.9vw,1.6rem)`, items separated by 10px accent squares.
- Infinite loop: track holds the sequence twice, `animation: marz-marquee 26s linear infinite` (translateX 0 → −50%). Respects `prefers-reduced-motion`.

### 4. About
- Giant outlined-by-fill watermark **`01`** (Pixelify 700, `clamp(9rem,26vw,22rem)`, color `rgba(31,70,255,0.07)`) bleeding off the top-right, `z-index:0`, `pointer-events:none`.
- `// About` mono label, then a large statement (Space Grotesk 500, `clamp(1.5rem,3vw,2.7rem)`, line-height 1.26) with one accent phrase. Max-width 62%.
- A right-aligned secondary paragraph (`--muted`, max-width 50ch) pushed to the right edge.

### 5. Selected Work
- `--bg-2` section. Watermark **`02`** (ink tint `rgba(11,11,12,0.05)`) bleeding top-left.
- Header: `Selected Work` (section title) + `[ 2024 — 2026 ]` mono.
- **Three offset cards** in a `flex-column`, each `width: min(100%,720px)`:
  - Alternating `align-self` (left / right / left).
  - Cards 2 & 3 use `margin-top: clamp(-44px,-4vw,-24px)` so they **overlap the previous card by ~37px**, ascending `z-index` (3,4,5).
  - White fill, 1px ink border, hard pixel shadow `8px 8px 0 rgba(11,11,12,0.08)`. Hover: `translate(-4px,-4px)` + shadow grows to `14px 14px 0 rgba(31,70,255,0.16)`.
  - **Index badge** (e.g. `01`): Pixelify 700, `clamp(3rem,6vw,5rem)`, **knockout** style — `color: var(--bg)` + `-webkit-text-stroke: 2px var(--ink)` — pinned to the top edge (`top: clamp(-30px,-2.4vw,-18px)`), on the opposite side to the card's alignment.
  - Title (Pixelify 600, `clamp(1.9rem,3vw,2.6rem)`), description (`--muted`, 15px, max-width 46ch), tech chips (mono 11px, 1px line border, `4px 9px`).

### 6. The Stack
- Watermark **`03`** (accent tint) bleeding top-right.
- `The Stack` title, then `repeat(auto-fit,minmax(200px,1fr))` columns, `gap: clamp(24px,4vw,48px)`, `align-items:start`.
- Columns are **vertically staggered** (`margin-top` 0 / `clamp(0,4vw,52px)` / `clamp(0,8vw,104px)`).
- Each column: uppercase mono category header with a 2px accent bottom border, then a list; each item = 7px accent square + label (16px).

### 7. Experience
- `--bg-2` section. Watermark **`04`** (ink tint) bleeding bottom-left.
- `Experience` title, then stacked entry rows (`grid-template-columns: 150px 1fr`), 1px ink borders (shared between rows), white fill, `width: min(100%,720px)`, **alternating** `margin-left:auto` / `margin-right:auto` for a staircase.
- Period (mono 13px; current role uses `--accent` + 700), role (Space Grotesk 600, `clamp(1.3rem,2.1vw,1.7rem)`), blurb (`--muted`, 15px, max-width 54ch).

### 8. Contact
- `05 / Contact` mono label with accent square.
- Giant wordmark **`LET'S BUILD.`** (Pixelify 700, `clamp(3.2rem,12vw,9rem)`, line-height 0.84) with the same blue registration echo; `BUILD.` is accent-colored on the front layer.
- Action row: **email** (dark button, `mailto:`), **GitHub** (ghost button, opens `@Marxz13`), **download cv** (ghost).
- **Contribution band:** 1px ink border, white fill, hard accent shadow `10px 10px 0 rgba(31,70,255,0.14)`. Header: `This year on GitHub` mono label + `6,000 contributions` (Pixelify number, Space Grotesk caption) + a GitHub link. Below: the `ContributionGraph` heatmap (7-row CSS grid, column flow, 3px gap, 371 cells).
- Footer: mono 11.5px, `© 2026 MARZ — Fullstack Developer` / `Built with GSAP · pixel-perfect`.

## Interactions & Behavior
- **Hero entrance (on mount):** GSAP timeline (`delay 0.1`, `power3.out`) — eyebrow → wordmark+statement (stagger 0.14) → intro → actions (stagger 0.09); the portrait frame slides in from `x:-20`. A safety timeout (`2900ms`) snaps the timeline to its end if the tab was throttled, so nothing stays hidden.
- **Scroll reveals:** every `[data-reveal]` element animates `opacity 0→1, y 26→0` (`power3.out`, 0.8s) via ScrollTrigger at `start: "top 90%"`. A `3200ms` safety clears props on any still-hidden, in-viewport element.
- **Pixel portrait:** on image load, a `{detail}` value tweens `0.04 → 1` with **`ease: steps(9)`** so the resolution snaps through 9 discrete levels (the "pixelated" reveal). On `mouseenter`, a faster `steps(7)` shimmer re-runs. Resize re-rasterizes sharp. A 2.9s safety forces a sharp final frame.
- **Marquee:** continuous; pauses under `prefers-reduced-motion`.
- **Buttons:** dark → background to `--accent` + `translateY(-2px)`; ghost → fills ink, text to paper. `:focus-visible` shows a 2px accent outline.
- **Cards:** lift + grow shadow on hover (see Work).

## Responsive Behavior
Desktop-first, fluid. All sizing uses `clamp()`/`vw`, and overlaps are computed from grid tracks + `vw`-scaled negative margins, so the layout reflows without breakpoints down to ~720px. **There are no mobile media queries** — if you need a polished phone layout, add breakpoints to: the hero grid (stack to one column, reset the wordmark `margin-left` to 0), the Work card offsets (drop negative margins), and the Stack column `margin-top` stagger. The watermark numerals can be reduced or hidden under ~600px.

## State Management
None beyond local refs. No data fetching. The contribution heatmap is generated deterministically from a seed (SSR/CSR identical). If you want real GitHub data, replace `ContributionGraph`'s `levelsFor()` with values from the GitHub contributions API and keep the same 0–4 level → color mapping.

## Design Tokens
| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | page background |
| `--bg-2` | `#F3F4F6` | alternating sections, card backing |
| `--ink` | `#0B0B0C` | text, borders, dark buttons |
| `--muted` | `#6B6F76` | secondary text |
| `--line` | `rgba(11,11,12,0.14)` | hairline borders/chips |
| `--grid` | `rgba(11,11,12,0.035)` | pixel-grid background lines |
| `--accent` | `#1F46FF` | electric blue — squares, highlights, hovers, top heatmap level |

- **Pixel-grid background:** two `linear-gradient` 1px lines, `background-size: 32px 32px`.
- **Type:** display `Pixelify Sans`; UI/body `Space Grotesk`; labels/mono `Space Mono`.
- **Type scale (clamp):** wordmark `4→9.5rem`; section watermark `9→22rem`; section title `1.7→2.6rem`; about statement `1.5→2.7rem`; project title `1.9→2.6rem`; body 15–16px; labels/chips 11–13px.
- **Radius:** `0` everywhere (sharp corners are intentional).
- **Shadows (hard/offset, no blur):** card `8px 8px 0 rgba(11,11,12,0.08)` → hover `14px 14px 0 rgba(31,70,255,0.16)`; contribution band `10px 10px 0 rgba(31,70,255,0.14)`.
- **Motion:** entrance `power3.out` 0.6–0.9s; reveals 0.8s at `top 90%`; pixel reveal `steps(9)` 1.9s, hover `steps(7)` 0.9s; marquee 26s linear.

## Assets
- **Portrait:** placeholder from Unsplash (`photo-1500648767791…`) set in `PROFILE.photo`. **Replace with Marz's real photo** (any aspect ratio — the canvas covers/crops to 4:5). The pixelization reads no pixel data, so cross-origin images display fine, but host your own for reliability.
- **Icons:** none — the only graphics are CSS squares (`▪`) and the `■`/`↗` glyphs. No icon library needed.
- **CV:** the "Download CV" links are `href="#"` placeholders — point them at a real résumé PDF.
- Contact email `hello@marz.dev` is a placeholder; GitHub is real (`github.com/Marxz13`).

## Files in this bundle
- `src/Portfolio.tsx` — main component + GSAP.
- `src/components/PixelPortrait.tsx`, `Marquee.tsx`, `ContributionGraph.tsx`.
- `src/data/portfolio.ts` — typed content (the file you edit most).
- `src/styles/portfolio.css` — tokens, fonts, keyframes, hover/focus.
- `reference/Marz Portfolio v2.dc.html` — original visual reference (not runnable standalone).
