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
 */
export interface PixelPortraitProps {
  src: string;
  /** Largest pixelation step count for the load reveal. */
  steps?: number;
  className?: string;
  style?: React.CSSProperties;
}

const MIN_DETAIL = 0.04;

export default function PixelPortrait({
  src,
  steps = 9,
  className,
  style,
}: PixelPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const tmpRef = useRef<HTMLCanvasElement | null>(null);
  const shimmering = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tmp = document.createElement("canvas");
    const tctx = tmp.getContext("2d")!;
    tmpRef.current = tmp;

    const sizeCanvas = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(2, Math.round(r.width * dpr));
      canvas.height = Math.max(2, Math.round(r.height * dpr));
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

    let safety: number | undefined;
    const ctxAnim = gsap.context(() => {});

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      drawFace(MIN_DETAIL); // immediate paint, never blank
      const obj = { d: MIN_DETAIL };
      gsap.to(obj, {
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

    // expose the shimmer to the hover handler below
    (canvas as any).__shimmer = () => {
      if (shimmering.current || !imgRef.current) return;
      shimmering.current = true;
      const obj = { d: 0.09 };
      gsap.to(obj, {
        d: 1,
        duration: 0.9,
        ease: "steps(7)",
        onUpdate: () => drawFace(obj.d),
        onComplete: () => {
          shimmering.current = false;
        },
      });
    };

    return () => {
      window.removeEventListener("resize", onResize);
      if (safety) clearTimeout(safety);
      ctxAnim.revert();
    };
  }, [src, steps]);

  const handleEnter = () => {
    const c = canvasRef.current as (HTMLCanvasElement & { __shimmer?: () => void }) | null;
    c?.__shimmer?.();
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
        data-pixel-portrait=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          filter: "grayscale(1) contrast(1.06)",
        }}
      />
    </div>
  );
}
