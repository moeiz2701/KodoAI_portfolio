"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { faq, faqEyebrow, faqIntro } from "@/lib/content";
import Hairline from "@/components/ui/Hairline";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 06 — Q&A (IMPLEMENTATION.md §9).
 * Single-open accordion: clicking a question animates its answer open (height
 * auto via Framer Motion) and closes any other. The GSAP reveal stays on the
 * item wrapper (.faq-item); Framer only animates the inner answer height, so
 * the two never fight (project rule: React/GSAP don't cross streams).
 * Reduced motion: reveal skipped and the open/close is instant.
 */
export default function FAQ() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotion();

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
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="faq-item border-t border-border">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left font-display text-2xl font-bold uppercase tracking-tight text-ink transition-colors hover:text-accent md:text-[28px]"
                >
                  {item.q}
                  <span
                    aria-hidden
                    className={`shrink-0 font-sans text-2xl transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-accent" : "text-ink-3"
                    }`}
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      key="answer"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { height: "auto", opacity: 1 },
                        collapsed: { height: 0, opacity: 0 },
                      }}
                      transition={
                        reduced
                          ? { duration: 0 }
                          : {
                              height: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                              opacity: { duration: 0.3, ease: "easeOut" },
                            }
                      }
                      className="overflow-hidden"
                    >
                      <p className="max-w-[60ch] pb-6 text-ink-2">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
