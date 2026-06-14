"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * PixelPortrait
 * ─────────────
 * Renders an image to a <canvas> and de-pixelates it on load using a
 * stepped GSAP tween (the resolution snaps through discrete levels, so
 * the reveal itself reads as "pixelated" — on brand). Re-shimmers on hover.
 *
 * The effect downscales the source onto a tiny offscreen canvas and draws
 * it back up with `imageSmoothingEnabled = false`. `detail` goes 0.04 → 1.
 *
 * No pixel data is read (no getImageData), so cross-origin images are fine
 * for display; the canvas is never exported.
 *
 * Accessibility: the canvas is exposed as role="img" with `label` as its
 * accessible name. Honors `prefers-reduced-motion` by painting sharp with
 * no animation and disabling the hover shimmer.
 */
export interface PixelPortraitProps {
  src: string;
  /** Accessible name for the portrait (becomes the canvas's aria-label). */
  label?: string;
  /** Largest pixelation step count for the load reveal. */
  steps?: number;
  className?: string;
  style?: React.CSSProperties;
}

const MIN_DETAIL = 0.04;
const MAX_DPR = 2;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PixelPortrait({
  src,
  label,
  steps = 9,
  className,
  style,
}: PixelPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const tmpRef = useRef<HTMLCanvasElement | null>(null);
  const shimmering = useRef(false);
  /** Hover-shimmer trigger, wired up by the effect (typed, no DOM stashing). */
  const shimmerFn = useRef<(() => void) | null>(null);

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
    let safety: number | undefined;
    // Cache the last downscale size so we don't reallocate the offscreen
    // backing store on every animation frame (the stepped tween fires
    // ~60fps but only ~`steps` distinct resolutions actually render).
    let lastSw = -1;
    let lastSh = -1;

    const sizeCanvas = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.max(2, Math.round(r.width * dpr));
      canvas.height = Math.max(2, Math.round(r.height * dpr));
      // A new backing store invalidates the cached downscale dimensions.
      lastSw = -1;
      lastSh = -1;
    };

    const drawCover = (
      c: CanvasRenderingContext2D,
      img: HTMLImageElement,
      w: number,
      h: number,
    ) => {
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
      c.clearRect(0, 0, w, h);
      c.drawImage(img, dx, dy, dw, dh);
    };

    const drawFace = (detail: number) => {
      const img = imgRef.current;
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

    sizeCanvas();

    const onResize = () => {
      sizeCanvas();
      drawFace(1);
    };
    window.addEventListener("resize", onResize);

    const reduce = prefersReducedMotion();

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!alive) return;
      imgRef.current = img;
      if (reduce) {
        drawFace(1); // sharp, no animation
        return;
      }
      drawFace(MIN_DETAIL); // immediate paint, never blank
      const obj = { d: MIN_DETAIL };
      loadTween = gsap.to(obj, {
        d: 1,
        duration: 1.9,
        ease: `steps(${steps})`,
        onUpdate: () => drawFace(obj.d),
        onComplete: () => drawFace(1),
      });
      // guarantee a sharp result even if rAF/GSAP is throttled
      safety = window.setTimeout(() => drawFace(1), 2900);
    };
    img.src = src;

    // Hover shimmer — only when motion is allowed.
    if (!reduce) {
      shimmerFn.current = () => {
        if (shimmering.current || !imgRef.current) return;
        shimmering.current = true;
        const obj = { d: 0.09 };
        shimmerTween = gsap.to(obj, {
          d: 1,
          duration: 0.9,
          ease: "steps(7)",
          onUpdate: () => drawFace(obj.d),
          onComplete: () => {
            shimmering.current = false;
          },
        });
      };
    }

    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
      if (safety) clearTimeout(safety);
      // Abort an in-flight decode whose onload would otherwise fire after
      // teardown (e.g. React StrictMode's mount→unmount→mount in dev).
      img.onload = null;
      img.src = "";
      loadTween?.kill();
      shimmerTween?.kill();
      shimmerFn.current = null;
    };
  }, [src, steps]);

  const handleEnter = () => {
    shimmerFn.current?.();
  };

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
        aria-label={label}
        data-pixel-portrait=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          filter: "grayscale(1) contrast(1.06)",
        }}
      >
        {label}
      </canvas>
    </div>
  );
}
