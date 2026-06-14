"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * PixelPortrait
 * ─────────────
 * One <canvas> pipeline that:
 *
 *  1. De-pixelates the primary image ("you") on load via a stepped GSAP tween
 *     (resolution snaps through discrete levels, so the reveal reads as
 *     "pixelated" - on brand). Re-shimmers on hover.
 *  2. On the FIRST window scroll past `threshold`, plays a smooth PIXEL-DISSOLVE
 *     swap: the current subject pixelates UP into chunky blocks, the drawn
 *     subject is swapped at the blockiest point, then the new subject (gorilla)
 *     de-pixelates back to sharp. It's one continuous detail tween, so it morphs
 *     smoothly instead of cutting.
 *  3. When the user returns to the very top (scrollY ~0), dissolves back to you
 *     (unless `oneWay`).
 *
 * Both sources are PRELOADED (decoded) up front; the trigger is only armed
 * once both are ready, so the swap never flashes/pops.
 *
 * Images are same-origin, so the canvas is never tainted. Every frame is a
 * single downscale + nearest-neighbour upscale draw - cheap, with the
 * transparent PNG background preserved for free.
 *
 * Accessibility: the canvas is role="img"; its accessible name tracks the
 * CURRENT subject (you vs gorilla). Honors prefers-reduced-motion by painting
 * sharp with no load animation, no hover shimmer, and an instant (hard-cut)
 * source swap on the same scroll triggers.
 */
export interface PixelPortraitProps {
  /** Primary subject shown on load ("you"). */
  src: string;
  /** Accessible name for the primary subject. */
  label?: string;
  /** Alternate subject swapped to on scroll (gorilla). Omit to disable swap. */
  altSrc?: string;
  /** Accessible name for the alternate subject. */
  altLabel?: string;
  /** Render in grayscale (default false → full color, as the hero needs). */
  grayscale?: boolean;
  /** Largest pixelation step count for the load reveal. */
  steps?: number;
  /** Scroll distance (px) that triggers the swap to the alt subject. */
  threshold?: number;
  /** When true, the alt subject stays after the first swap (no swap back). */
  oneWay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

type Subject = "primary" | "alt";

const MIN_DETAIL = 0.04;
const MAX_DPR = 2;
/* Pixel-dissolve swap timing (s): pixelate the current subject UP, swap at the
   blockiest point, then de-pixelate the new subject back to sharp. */
const SWAP_OUT = 0.34; // pixelate-up (lose detail)
const SWAP_IN = 0.5; //   de-pixelate (regain detail)
/** Chunkiest pixel level reached at the swap midpoint (smaller = blockier). */
const SWAP_FLOOR = 0.045;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PixelPortrait({
  src,
  label,
  altSrc,
  altLabel,
  grayscale = false,
  steps = 9,
  threshold = 40,
  oneWay = false,
  className,
  style,
}: PixelPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  /** Decoded images, keyed by subject. */
  const primaryImgRef = useRef<HTMLImageElement | null>(null);
  const altImgRef = useRef<HTMLImageElement | null>(null);
  /** Offscreen downscale buffer for the pixelation passes. */
  const tmpRef = useRef<HTMLCanvasElement | null>(null);
  const shimmering = useRef(false);
  /** Hover-shimmer trigger, wired up by the effect (typed, no DOM stashing). */
  const shimmerFn = useRef<(() => void) | null>(null);
  /** Which subject is currently drawn; drives the accessible name. */
  const subjectRef = useRef<Subject>("primary");
  const [subject, setSubject] = useState<Subject>("primary");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tmp = document.createElement("canvas");
    const tctx = tmp.getContext("2d")!;
    tmpRef.current = tmp;

    // Effect-local lifecycle state.
    let alive = true;
    let loadTween: gsap.core.Tween | undefined;
    let shimmerTween: gsap.core.Tween | undefined;
    let swapTween: gsap.core.Timeline | undefined;
    let safety: number | undefined;
    let swapSafety: number | undefined;
    let rafId: number | undefined;
    let scrollScheduled = false;
    let swapping = false;
    // Cache the last downscale size so we don't reallocate the offscreen
    // backing store on every animation frame of a pixelation tween.
    let lastSw = -1;
    let lastSh = -1;

    const reduce = prefersReducedMotion();

    const imgFor = (s: Subject): HTMLImageElement | null =>
      s === "alt" ? altImgRef.current : primaryImgRef.current;
    const currentImg = (): HTMLImageElement | null => imgFor(subjectRef.current);

    const sizeCanvas = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.max(2, Math.round(r.width * dpr));
      canvas.height = Math.max(2, Math.round(r.height * dpr));
      // A new backing store invalidates the cached downscale dimensions.
      lastSw = -1;
      lastSh = -1;
    };

    const coverRect = (img: HTMLImageElement, w: number, h: number) => {
      const ir = img.width / img.height;
      const r = w / h;
      let dw: number, dh: number, dx: number, dy: number;
      if (ir > r) {
        dh = h;
        dw = h * ir;
        dx = (w - dw) / 2;
        dy = 0;
      } else {
        dw = w;
        dh = w / ir;
        dx = 0;
        dy = (h - dh) / 2;
      }
      return { dx, dy, dw, dh };
    };

    const drawCover = (
      c: CanvasRenderingContext2D,
      img: HTMLImageElement,
      w: number,
      h: number,
    ) => {
      const { dx, dy, dw, dh } = coverRect(img, w, h);
      c.clearRect(0, 0, w, h);
      c.drawImage(img, dx, dy, dw, dh);
    };

    /** Stepped-pixelation paint of the CURRENT subject at `detail` ∈ (0,1]. */
    const drawFace = (detail: number) => {
      const img = currentImg();
      if (!img) return;
      const W = canvas.width;
      const H = canvas.height;
      const d = Math.max(0.012, Math.min(1, detail));
      const sw = Math.max(2, Math.round(W * d));
      const sh = Math.max(2, Math.round(H * d));
      // Identical resolution → identical output; skip the redundant work.
      if (sw === lastSw && sh === lastSh) return;
      lastSw = sw;
      lastSh = sh;
      tmp.width = sw;
      tmp.height = sh;
      tctx.imageSmoothingEnabled = true;
      drawCover(tctx, img, sw, sh);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(tmp, 0, 0, sw, sh, 0, 0, W, H);
    };

    /** Sharp, full-resolution paint of the current subject (no pixelation). */
    const drawSharp = () => {
      const img = currentImg();
      if (!img) return;
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCover(ctx, img, canvas.width, canvas.height);
      lastSw = -1;
      lastSh = -1;
    };

    sizeCanvas();

    const onResize = () => {
      sizeCanvas();
      if (!swapping) drawSharp();
    };
    window.addEventListener("resize", onResize);

    /** Force the settled, sharp result for `to` and clear swap state. */
    const settle = (to: Subject) => {
      subjectRef.current = to;
      drawSharp();
      swapping = false;
      // If the scroll position crossed a threshold during the (locked-out)
      // dissolve, fire the opposite transition now instead of waiting for the
      // next scroll event. `reconcileScroll` is a hoisted fn declaration, so it
      // is in scope here even though `evalScroll` is defined further down.
      rafId = window.requestAnimationFrame(() => {
        if (alive && !swapping) reconcileScroll();
      });
    };

    // Hoisted so `settle()` above can call it; the body runs only at call time,
    // by which point `evalScroll` (a const below) is defined.
    function reconcileScroll() {
      evalScroll();
    }

    /**
     * Smooth pixel-dissolve to `to`: a continuous detail tween pixelates the
     * current subject UP into chunky blocks (power-eased so it accelerates into
     * the blur), swaps the drawn subject at the blockiest point, then
     * de-pixelates the new subject back down to sharp. Reusing the same
     * downscale → nearest-neighbour-upscale draw as the load reveal keeps it
     * unmistakably "pixelated" while reading as one smooth morph.
     */
    const runSwap = (to: Subject) => {
      if (swapping) return;
      const target = imgFor(to);
      if (!target) return;

      if (reduce) {
        // Hard cut: no animation, just a correct sharp image + a11y update.
        subjectRef.current = to;
        setSubject(to);
        drawSharp();
        return;
      }

      swapping = true;
      let swapped = false;

      // Latched mid-dissolve swap of the rendered subject + accessible name.
      const doSwap = () => {
        if (swapped) return;
        swapped = true;
        subjectRef.current = to;
        setSubject(to);
        // Force the NEW subject to (re)draw even at the same detail level.
        lastSw = -1;
        lastSh = -1;
      };

      const obj = { d: 1 };
      swapTween?.kill();
      swapTween = gsap.timeline({
        onComplete: () => {
          doSwap();
          settle(to);
        },
      });
      swapTween
        // pixelate the current subject up into blocks…
        .to(obj, {
          d: SWAP_FLOOR,
          duration: SWAP_OUT,
          ease: "power3.in",
          onUpdate: () => {
            if (!swapped) drawFace(obj.d);
          },
        })
        // …swap subjects at the blockiest point…
        .call(doSwap)
        // …then de-pixelate the new subject back to sharp.
        .to(obj, {
          d: 1,
          duration: SWAP_IN,
          ease: "power2.out",
          onUpdate: () => drawFace(obj.d),
        });

      // Guarantee a sharp settle even if rAF/GSAP is throttled (e.g. tab blur).
      swapSafety = window.setTimeout(() => {
        if (!alive || !swapping) return;
        swapTween?.kill();
        doSwap();
        settle(to);
      }, (SWAP_OUT + SWAP_IN) * 1000 + 600);
    };

    // ── Scroll trigger ──────────────────────────────────────────────────
    // Fire ONCE per state change, guarded by the current subject. A passive
    // listener schedules a single rAF read (no layout thrash, no per-event work).
    const evalScroll = () => {
      scrollScheduled = false;
      if (!alive) return;
      // Only act once both images are decoded (set in the preload step).
      if (!primaryImgRef.current || !altImgRef.current) return;
      const y = window.scrollY || window.pageYOffset || 0;
      if (subjectRef.current === "primary" && y > threshold) {
        runSwap("alt");
      } else if (!oneWay && subjectRef.current === "alt" && y <= 1) {
        runSwap("primary");
      }
    };
    const onScroll = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      rafId = window.requestAnimationFrame(evalScroll);
    };

    // ── Preload + decode both images, then arm the trigger ──────────────
    const primaryImg = new Image();
    primaryImg.crossOrigin = "anonymous";
    const altImg = altSrc ? new Image() : null;
    if (altImg) altImg.crossOrigin = "anonymous";

    let primaryReady = false;
    let altReady = !altSrc; // no alt → already "ready" for arming purposes

    const armScrollOnce = () => {
      if (!alive || !altSrc) return; // nothing to swap to → don't arm
      window.addEventListener("scroll", onScroll, { passive: true });
      // Evaluate immediately in case the page loaded already scrolled down.
      onScroll();
    };

    const maybeArm = () => {
      if (primaryReady && altReady) armScrollOnce();
    };

    primaryImg.onload = () => {
      if (!alive) return;
      primaryImgRef.current = primaryImg;
      primaryReady = true;
      // Warm the GPU upload so the first reveal frame can't stutter.
      primaryImg.decode?.().catch(() => {});
      if (subjectRef.current === "primary") {
        if (reduce) {
          drawSharp(); // sharp, no animation
        } else {
          drawFace(MIN_DETAIL); // immediate paint, never blank
          const obj = { d: MIN_DETAIL };
          loadTween?.kill();
          loadTween = gsap.to(obj, {
            d: 1,
            duration: 1.9,
            ease: `steps(${steps})`,
            onUpdate: () => {
              if (!swapping && subjectRef.current === "primary")
                drawFace(obj.d);
            },
            onComplete: () => {
              if (!swapping && subjectRef.current === "primary") drawSharp();
            },
          });
          // Guarantee a sharp result even if rAF/GSAP is throttled.
          safety = window.setTimeout(() => {
            if (!swapping && subjectRef.current === "primary") drawSharp();
          }, 2900);
        }
      }
      maybeArm();
    };
    primaryImg.src = src;

    if (altImg && altSrc) {
      altImg.onload = () => {
        if (!alive) return;
        altImgRef.current = altImg;
        altReady = true;
        // Decode off the main path so the eventual swap never janks.
        altImg.decode?.().catch(() => {});
        maybeArm();
      };
      altImg.src = altSrc;
    }

    // Hover shimmer - only when motion is allowed and not mid-swap.
    if (!reduce) {
      shimmerFn.current = () => {
        if (shimmering.current || swapping || !currentImg()) return;
        shimmering.current = true;
        const obj = { d: 0.09 };
        shimmerTween?.kill();
        shimmerTween = gsap.to(obj, {
          d: 1,
          duration: 0.9,
          ease: "steps(7)",
          onUpdate: () => {
            if (!swapping) drawFace(obj.d);
          },
          onComplete: () => {
            shimmering.current = false;
            if (!swapping) drawSharp();
          },
        });
      };
    }

    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (safety) clearTimeout(safety);
      if (swapSafety) clearTimeout(swapSafety);
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      // Abort in-flight decodes whose onload would fire after teardown
      // (e.g. React StrictMode's mount→unmount→mount in dev).
      primaryImg.onload = null;
      primaryImg.src = "";
      if (altImg) {
        altImg.onload = null;
        altImg.src = "";
      }
      loadTween?.kill();
      shimmerTween?.kill();
      swapTween?.kill();
      shimmerFn.current = null;
    };
    // `subject` is intentionally NOT a dep: it's mirrored in subjectRef and
    // only drives the JSX accessible name, never the effect's draw logic.
  }, [src, altSrc, steps, threshold, oneWay]);

  const handleEnter = () => {
    shimmerFn.current?.();
  };

  const accessibleName = subject === "alt" ? altLabel ?? label : label;

  return (
    <div
      className={className}
      onMouseEnter={handleEnter}
      style={{
        position: "relative",
        aspectRatio: "4 / 5",
        overflow: "hidden",
        border: "1px solid var(--ink)",
        background: "var(--bg-2)",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={accessibleName}
        data-pixel-portrait=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          filter: grayscale ? "grayscale(1) contrast(1.06)" : "none",
        }}
      >
        {accessibleName}
      </canvas>
    </div>
  );
}
