"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { hero, site } from "@/lib/content";
import DotMatrix from "@/components/canvas/DotMatrix";

gsap.registerPlugin(ScrollTrigger);

// KODOAI split into letters; the AI pair carries the accent.
const LETTERS = [
  ...site.wordmark.light.split("").map((c) => ({ c, accent: false })),
  ...site.wordmark.accent.split("").map((c) => ({ c, accent: true })),
];

/**
 * Section 01 — HERO (IMPLEMENTATION.md §4).
 * DotMatrix background, layered composition, wordmark letter entrance and a
 * scroll parallax/fade. All motion is gated behind prefers-reduced-motion.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return; // static frame: letters + copy at rest, no scrub

      // Wordmark entrance — letters rise from below the fold (§4.1).
      gsap.from(".hero-letter", {
        yPercent: 100,
        duration: 1.2,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.15,
      });

      // Scroll: copy parallaxes up, wordmark scales down + fades (§4.1).
      const st = {
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      } as const;
      gsap.to(centerRef.current, { yPercent: -30, ease: "none", scrollTrigger: st });
      gsap.to(wordmarkRef.current, {
        scale: 0.95,
        opacity: 0,
        transformOrigin: "50% 100%",
        ease: "none",
        scrollTrigger: st,
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
    >
      {/* Real heading for a11y — the giant wordmark below is decorative. */}
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>

      {/* z-0 — living banner canvas */}
      <DotMatrix intensity={1} />

      {/* z-1 — radial vignette darkening the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* z-1 — minimal accent glow for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(55% 45% at 50% 58%, var(--accent-glow), transparent 70%)",
        }}
      />

      {/* z-2 — center block */}
      <div ref={centerRef} className="relative z-[2] flex flex-col items-center px-6 text-center">
        {/* Description: both lines share one font, size and muted tone — kept small
            and quiet so the giant wordmark carries the hero. Nudged up toward the
            top third. */}
        <div className="flex max-w-[44ch] -translate-y-[10vh] flex-col gap-2 text-ink-3">
          <h2 className="text-sm font-normal leading-relaxed tracking-wide md:text-base">
            {hero.headline}
          </h2>
          <p className="text-sm font-normal leading-relaxed tracking-wide md:text-base">
            {hero.sub}
          </p>
        </div>
      </div>

      {/* z-3 — giant wordmark, baseline clipped, blends over the canvas */}
      <div
        ref={wordmarkRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex justify-center"
        style={{ transform: "translateY(-5%)", mixBlendMode: "screen" }}
      >
        <span
          className="font-display font-black leading-[0.75]"
          style={{ fontSize: "clamp(140px, 26vw, 480px)", letterSpacing: "-0.03em" }}
        >
          {LETTERS.map((l, i) => (
            <span
              key={i}
              className="hero-letter inline-block"
              style={{
                color: l.accent ? "var(--accent)" : "var(--ink)",
                opacity: l.accent ? 0.55 : 0.35,
              }}
            >
              {l.c}
            </span>
          ))}
        </span>
      </div>
    </section>
  );
}
