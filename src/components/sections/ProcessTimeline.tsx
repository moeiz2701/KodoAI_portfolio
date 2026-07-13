"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { process, processEyebrow } from "@/lib/content";
import Hairline from "@/components/ui/Hairline";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 03 — PROCESS TIMELINE (IMPLEMENTATION.md §6).
 *
 * Desktop (md+, motion-safe): a pinned panel. Scrubbing advances through the 4
 * phases with a crossfade; the top rail is the node-graph — 4 square nodes with
 * an accent line that draws itself and ticks that light up as they're passed.
 * Mobile / reduced-motion: no pin — a plain vertical stack with fade-up reveals
 * (static under reduced motion). Pinned scrub on touch is the #1 janky-agency
 * mistake (decision #6), so we don't fight it.
 */
export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;
      const accent =
        getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c8f060";
      const border =
        getComputedStyle(document.documentElement).getPropertyValue("--border").trim() || "#2a2a26";

      const mm = gsap.matchMedia();

      // ---- Desktop: pinned, scrubbed, snapping panel --------------------------
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".t-phase", root);
        const ticks = gsap.utils.toArray<HTMLElement>(".t-tick", root);
        const line = root.querySelector<HTMLElement>(".t-line");
        const N = panels.length;

        gsap.set(line, { scaleX: 1 / N });
        gsap.set(panels, { opacity: 0, yPercent: 8 });
        gsap.set(panels[0], { opacity: 1, yPercent: 0 });
        gsap.set(ticks, { backgroundColor: border });
        gsap.set(ticks[0], { backgroundColor: accent });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: "+=300%", // 3 transitions across 4 panels
            pin: true,
            scrub: 0.8,
            snap: 1 / (N - 1),
          },
        });

        for (let i = 0; i < N - 1; i++) {
          tl.to(line, { scaleX: (i + 2) / N, ease: "none" }, i);
          tl.to(panels[i], { opacity: 0, yPercent: -8, ease: "none" }, i);
          tl.fromTo(
            panels[i + 1],
            { opacity: 0, yPercent: 8 },
            { opacity: 1, yPercent: 0, ease: "none" },
            i,
          );
          tl.to(ticks[i + 1], { backgroundColor: accent, duration: 0.25, ease: "none" }, i + 0.4);
        }
      });

      // ---- Mobile: simple fade-up reveals (no pin) ---------------------------
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".t-stack-item", root).forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 24,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="process" className="relative depth">
      <Hairline className="absolute inset-x-0 top-0 z-20" />

      {/* ---- Desktop pinned panel (md+, motion-safe) ---- */}
      <div className="hidden motion-safe:md:block">
        <div ref={pinRef} className="relative flex h-screen flex-col overflow-hidden">
          {/* eyebrow + progress rail / node-graph */}
          <div className="shell relative z-10 pt-28">
            <p className="eyebrow flex items-center gap-2">
              <span className="h-[8px] w-[8px] bg-accent" aria-hidden />
              {processEyebrow}
            </p>
            <div className="relative mt-8 h-px w-full bg-border">
              <div
                className="t-line absolute inset-y-0 left-0 w-full origin-left bg-accent"
                style={{ transform: "scaleX(0.25)" }}
                aria-hidden
              />
              {process.map((p, i) => (
                <span
                  key={p.n}
                  className="t-tick absolute top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 bg-border"
                  style={{ left: `${(i / (process.length - 1)) * 100}%` }}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          {/* stacked phase panels, crossfaded by the timeline */}
          <div className="shell relative z-10 flex-1">
            <div className="relative h-full">
              {process.map((p, i) => (
                <div
                  key={p.n}
                  className="t-phase absolute inset-0 grid content-center gap-8 md:grid-cols-[0.6fr_0.4fr] md:gap-12"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  {/* left: ghost number + overlapping title */}
                  <div className="relative flex items-center">
                    <span
                      aria-hidden
                      className="pointer-events-none block font-display font-black leading-none text-surface-3"
                      style={{ fontSize: "clamp(160px, 24vw, 340px)" }}
                    >
                      {p.n}
                    </span>
                    <h3 className="absolute bottom-[18%] left-0 font-display text-[clamp(48px,7vw,88px)] font-extrabold uppercase leading-none tracking-tight text-ink">
                      {p.title}
                    </h3>
                  </div>

                  {/* right: body + mono chips */}
                  <div className="flex flex-col gap-6 self-center">
                    <p className="max-w-[44ch] text-lg leading-relaxed text-ink-2">{p.body}</p>
                    <ul className="flex flex-wrap gap-2">
                      {p.chips.map((c) => (
                        <li key={c} className="badge">
                          {`// ${c}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Mobile / reduced-motion vertical stack ---- */}
      <div className="motion-safe:md:hidden py-24">
        <div className="shell">
          <p className="eyebrow mb-12 flex items-center gap-2">
            <span className="h-[8px] w-[8px] bg-accent" aria-hidden />
            {processEyebrow}
          </p>
          <ol className="flex flex-col">
            {process.map((p) => (
              <li key={p.n} className="t-stack-item grid gap-6 border-t border-border py-12">
                <div className="relative">
                  <span
                    aria-hidden
                    className="pointer-events-none block font-display font-black leading-none text-surface-3"
                    style={{ fontSize: "clamp(90px, 14vw, 220px)" }}
                  >
                    {p.n}
                  </span>
                  <h3 className="mt-[-0.35em] font-display text-[clamp(36px,5vw,72px)] font-extrabold uppercase leading-none tracking-tight text-ink">
                    {p.title}
                  </h3>
                </div>
                <div className="flex flex-col gap-6">
                  <p className="max-w-[44ch] text-lg leading-relaxed text-ink-2">{p.body}</p>
                  <ul className="flex flex-wrap gap-2">
                    {p.chips.map((c) => (
                      <li key={c} className="badge">
                        {`// ${c}`}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
