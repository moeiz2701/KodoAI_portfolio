"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { services, servicesEyebrow } from "@/lib/content";
import Hairline from "@/components/ui/Hairline";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 05 — SERVICES (IMPLEMENTATION.md §8).
 * The item nearest viewport centre (or hovered) takes focus: full ink, indented
 * 24px, with its mono index and descriptor revealed. Everything else dims to
 * 0.18. Reduced-motion users get the full list at rest, all legible.
 */
export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [scrollActive, setScrollActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? scrollActive;

  useGSAP(
    () => {
      const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setReduced(r);
      if (r) return; // no scroll-driven focus for reduced motion

      gsap.utils.toArray<HTMLElement>(".svc-item").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setScrollActive(i);
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" className="relative depth py-24 md:py-32">
      <Hairline className="absolute inset-x-0 top-0" />
      <div className="shell">
        <p className="eyebrow mb-16 flex items-center gap-2">
          <span className="h-[8px] w-[8px] bg-accent" aria-hidden />
          {servicesEyebrow}
        </p>

        <ul className="flex flex-col">
          {services.map((s, i) => {
            const isActive = active === i;
            const dimmed = !reduced && !isActive;
            const focused = !reduced && isActive;
            const descOpen = reduced || isActive;
            return (
              <li
                key={s.title}
                className="svc-item border-t border-border py-6 transition-[opacity,transform] duration-300 ease-out"
                style={{ opacity: dimmed ? 0.18 : 1, transform: focused ? "translateX(24px)" : "none" }}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <span
                    className="eyebrow shrink-0 text-accent transition-opacity duration-300"
                    style={{ opacity: reduced || isActive ? 1 : 0 }}
                  >
                    {`// 0${i + 1}`}
                  </span>
                  <h3 className="font-display text-[clamp(40px,7.5vw,120px)] font-extrabold uppercase leading-[1.02] tracking-tight text-ink">
                    {s.title}
                  </h3>
                </div>
                <p
                  className="overflow-hidden text-ink-3 transition-all duration-300 md:ml-[calc(3ch+1rem)]"
                  style={{
                    opacity: descOpen ? 1 : 0,
                    maxHeight: descOpen ? "6rem" : 0,
                    marginTop: descOpen ? "0.5rem" : 0,
                  }}
                >
                  {s.desc}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
