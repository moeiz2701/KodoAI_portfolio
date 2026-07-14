"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { process, processEyebrow } from "@/lib/content";
import Hairline from "@/components/ui/Hairline";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 03 — PROCESS TIMELINE (IMPLEMENTATION.md §6, reworked).
 *
 * Normal vertical scroll — no pin. Each phase is a full-bleed band that
 * alternates dark / accent-green (green bands carry black content). Inside each
 * band the original layout returns: a giant ghost number with the phase title
 * overlapping on the left, body copy + mono chips on the right.
 *
 * As a band enters, its content assembles smoothly on one timeline — the ghost
 * number rises, the title lifts in over it, then the body and chips follow. The
 * green centre line draws down, scrubbed to the band's scroll. Reduced motion:
 * lines full, everything at rest.
 */
export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set(".t-divider", { scaleY: 1 });
        return;
      }

      gsap.utils.toArray<HTMLElement>(".t-band").forEach((band) => {
        // Content assembles smoothly as the band enters the frame.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: band, start: "top 72%", once: true },
        });
        tl.from(band.querySelector(".t-num"), {
          yPercent: 18,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        })
          .from(
            band.querySelector(".t-title"),
            { y: 48, opacity: 0, duration: 0.8, ease: "power4.out" },
            "-=0.65",
          )
          .from(
            band.querySelector(".t-body"),
            { y: 28, opacity: 0, duration: 0.7, ease: "power3.out" },
            "-=0.5",
          )
          .from(
            band.querySelectorAll(".t-chip"),
            { y: 14, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" },
            "-=0.4",
          );

        // Green centre line draws down, scrubbed to the band's scroll.
        const line = band.querySelector(".t-divider");
        if (line) {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: band, start: "top 80%", end: "bottom 60%", scrub: true },
            },
          );
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="process" className="relative">
      <Hairline className="absolute inset-x-0 top-0 z-10" />

      <div className="shell pt-20 md:pt-28">
        <p className="eyebrow flex items-center gap-2">
          <span className="h-[8px] w-[8px] bg-accent" aria-hidden />
          {processEyebrow}
        </p>
      </div>

      <div className="mt-10 flex flex-col">
        {process.map((p, i) => {
          const green = i % 2 === 1;
          return (
            <div key={p.n} className={`t-band ${green ? "bg-accent" : ""}`}>
              <div className="shell py-16 md:py-24">
                <div className="relative grid items-center gap-10 md:grid-cols-[0.62fr_0.38fr] md:gap-0">
                  {/* green line down the middle (desktop) */}
                  <span
                    aria-hidden
                    className={`t-divider absolute left-[62%] top-0 -ml-px hidden h-full w-0.5 origin-top md:block ${
                      green ? "bg-bg" : "bg-accent"
                    }`}
                    style={{ transform: "scaleY(0)" }}
                  />

                  {/* left: giant ghost number + overlapping title */}
                  <div className="relative flex items-center md:pr-14">
                    <span
                      aria-hidden
                      className={`t-num pointer-events-none block font-display font-black leading-none ${
                        green ? "text-bg/20" : "text-surface-3"
                      }`}
                      style={{ fontSize: "clamp(140px, 22vw, 320px)" }}
                    >
                      {p.n}
                    </span>
                    <h3
                      className={`t-title absolute bottom-[16%] left-0 font-display text-[clamp(56px,9vw,120px)] font-extrabold uppercase leading-none tracking-tight ${
                        green ? "text-bg" : "text-ink"
                      }`}
                    >
                      {p.title}
                    </h3>
                  </div>

                  {/* right: body + mono chips */}
                  <div className="flex flex-col gap-6 md:pl-14">
                    <p
                      className={`t-body max-w-[46ch] text-lg leading-relaxed ${green ? "text-bg" : "text-ink-2"}`}
                    >
                      {p.body}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {p.chips.map((c) => (
                        <li key={c} className={green ? "t-chip badge border-bg text-bg" : "t-chip badge"}>
                          {`// ${c}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
