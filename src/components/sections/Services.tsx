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
 * 0.18. On enter, the eyebrow and each row fade up in sequence. Reduced motion:
 * full list at rest, all legible.
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
      if (r) return; // no scroll-driven focus / reveals for reduced motion

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

      // Smooth entrance: eyebrow, then each row. The reveal rides an inner
      // wrapper, not the <li> itself, whose opacity/transform is React-controlled
      // by the focus effect (animating both would fight).
      gsap.from(".svc-head", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
      gsap.from(".svc-inner", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".svc-list", start: "top 82%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" className="relative py-24 md:py-32">
      <Hairline className="absolute inset-x-0 top-0" />
      <div className="shell">
        <p className="svc-head eyebrow mb-16 flex items-center gap-2">
          <span className="h-[8px] w-[8px] bg-accent" aria-hidden />
          {servicesEyebrow}
        </p>

        <ul className="svc-list flex flex-col">
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
                <div className="svc-inner">
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
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
