"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

/** Read a `#rrggbb` CSS variable as an [r,g,b] triple (token rule: no hardcoded hex). */
function readRGB(varName: string, fallback: [number, number, number]): [number, number, number] {
  if (typeof window === "undefined") return fallback;
  const hex = getComputedStyle(document.documentElement).getPropertyValue(varName).trim().replace("#", "");
  if (hex.length >= 6) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  return fallback;
}

/**
 * Section 01 background — the "Living Banner" (IMPLEMENTATION.md §4.2).
 * A grid of × / · glyphs whose brightness is driven by layered simplex noise,
 * so the banner's dot-matrix cloud breathes, dissolves and reforms. Reused in
 * the footer at low intensity.
 *
 * Procedural only — never samples reference/banner.png.
 *
 * The per-frame cost scales with the canvas area (cells × devicePixelRatio).
 * The footer canvas is much taller than the hero, so it takes the cheaper knobs
 * (`fps` cap, lower `maxDpr`, bigger `cellScale`, no cursor `interactive`) to
 * stay smooth. Defaults keep the hero exactly as it was.
 */
export default function DotMatrix({
  intensity = 1,
  fps = 0,
  maxDpr = 2,
  cellScale = 1,
  interactive = true,
}: {
  intensity?: number;
  /** Redraw cap; 0 = uncapped (native rAF, ~60fps). */
  fps?: number;
  /** Backing-store resolution cap (min with devicePixelRatio). */
  maxDpr?: number;
  /** Multiplies the base cell size; >1 → fewer dots. */
  cellScale?: number;
  /** Cursor excitation (adds a per-cell distance calc + a window listener). */
  interactive?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Tight grid → the dots pack into a soft cloud (banner look) rather than a
    // sparse cross matrix. Larger cell on mobile keeps the draw count sane.
    const CELL = Math.round((isMobile ? 20 : 14) * cellScale);
    const TAU = Math.PI * 2;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const noise3D = createNoise3D();
    const [dr, dg, db] = readRGB("--ink-2", [196, 194, 184]);
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c8f060";

    let raf = 0;
    let t = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr); // setting width/height reset the transform, so re-apply
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const trackCursor = interactive && !isMobile && !reduced;
    if (trackCursor) window.addEventListener("pointermove", onMove);

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      for (let x = CELL / 2; x < W; x += CELL) {
        for (let y = CELL / 2; y < H; y += CELL) {
          // two noise octaves → cloud shape like the banner
          let n =
            noise3D(x * 0.0016, y * 0.0022, t) * 0.7 +
            noise3D(x * 0.006, y * 0.006, t * 2) * 0.3;
          n = (n + 1) / 2; // 0..1
          n *= 1.15 - (x / W) * 0.85; // denser left, fades right (banner composition)

          let b = n * intensity;
          if (trackCursor) {
            const d = Math.hypot(mouse.x - x, mouse.y - y);
            b += Math.max(0, 1 - d / 180) * 0.6; // cursor excitation
          }
          b = Math.min(1, b);
          if (b < 0.14) continue; // empty cell

          // Soft dot whose radius grows with brightness — dense areas read as
          // cloud, sparse edges as scattered specks (banner composition).
          const ping = Math.random() < 0.00006; // rare signal flicker
          const radius = 0.6 + b * 1.7;
          ctx.beginPath();
          ctx.arc(x, y, ping ? radius + 0.6 : radius, 0, TAU);
          ctx.fillStyle = ping ? accent : `rgba(${dr}, ${dg}, ${db}, ${(b * 0.6).toFixed(3)})`;
          ctx.fill();
        }
      }
    };

    // Optional frame-rate cap: for large/low-priority canvases (the footer) a
    // slow-drift cloud looks the same at ~30fps but costs half as much.
    const frameInterval = fps > 0 ? 1000 / fps : 0;
    let last = -Infinity;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < frameInterval) return; // skip this frame (throttled)
      last = now;
      t += 0.0016; // slow drift
      draw();
    };

    // Pause the loop while the canvas is off-screen (perf rule §4.2).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduced) return;
        if (entry.isIntersecting && !raf) {
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    if (reduced) {
      draw(); // one static frame, no loop
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      if (trackCursor) window.removeEventListener("pointermove", onMove);
    };
  }, [intensity, fps, maxDpr, cellScale, interactive]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}
