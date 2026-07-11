"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { quotation } from "@/lib/content";
import { splitWords } from "@/lib/splitWords";
import Hairline from "@/components/ui/Hairline";

gsap.registerPlugin(ScrollTrigger);

const WORDS = splitWords(quotation.text, quotation.highlights);

/**
 * Section 02 — QUOTATION (IMPLEMENTATION.md §5).
 * Scrubbed reading-highlight: every word resolves from --muted to its base
 * colour (ink, or accent for the two key phrases) as you scroll through.
 */
export default function Quotation() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return; // words stay at their natural ink/accent colour

      const muted =
        getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() || "#5e5c52";

      gsap.from(".q-word", {
        color: muted,
        ease: "none",
        stagger: 0.4,
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          end: "bottom 55%",
          scrub: 1,
        },
      });

      gsap.from(".q-attr", {
        opacity: 0,
        y: 12,
        duration: 0.6,
        scrollTrigger: { trigger: root.current, start: "bottom 65%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="quotation" className="relative flex min-h-screen items-center bg-bg">
      <Hairline className="absolute inset-x-0 top-0" />
      <div className="shell">
        <p className="eyebrow mb-10">{quotation.eyebrow}</p>
        <blockquote className="max-w-[1100px] font-display text-[clamp(40px,6vw,96px)] font-extrabold uppercase leading-none tracking-tight">
          {WORDS.map((w, i) => (
            <span key={i} className={w.highlight ? "q-word text-accent" : "q-word text-ink"}>
              {w.text}{" "}
            </span>
          ))}
        </blockquote>
        <p className="q-attr eyebrow mt-10">— {quotation.attribution}</p>
      </div>
    </section>
  );
}
