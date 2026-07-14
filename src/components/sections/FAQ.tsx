"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { faq, faqEyebrow, faqIntro } from "@/lib/content";
import Hairline from "@/components/ui/Hairline";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 06 — Q&A (IMPLEMENTATION.md §9).
 * Accessible native <details> accordion. The header and each item fade up
 * smoothly as they enter. Reduced motion: content at rest.
 */
export default function FAQ() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".faq-head", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });
      gsap.from(".faq-item", {
        opacity: 0,
        y: 28,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".faq-list", start: "top 82%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="faq" className="relative py-24 md:py-32">
      <Hairline className="absolute inset-x-0 top-0" />
      <div className="shell grid gap-12 md:grid-cols-[0.4fr_0.6fr]">
        {/* left sticky header */}
        <div className="faq-head md:sticky md:top-32 md:h-max">
          <h2 className="font-display text-[clamp(36px,5vw,56px)] font-extrabold uppercase leading-none tracking-tight text-ink">
            Questions,
            <br />
            Answered
          </h2>
          <p className="eyebrow mt-6">{faqEyebrow}</p>
          <p className="mt-3 text-ink-3">{faqIntro}</p>
        </div>

        {/* right accordion */}
        <div className="faq-list flex flex-col">
          {faq.map((item) => (
            <details key={item.q} className="faq-item group border-t border-border py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-2xl font-bold uppercase tracking-tight text-ink md:text-[28px] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="shrink-0 font-sans text-2xl text-ink-3 transition-transform duration-300 group-open:rotate-45 group-open:text-accent"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[60ch] text-ink-2">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
