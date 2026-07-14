"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects, projectsHeading } from "@/lib/projects";
import Hairline from "@/components/ui/Hairline";
import ProjectMedia from "@/components/ui/ProjectMedia";

gsap.registerPlugin(ScrollTrigger);

const [HEAD_A, HEAD_B] = projectsHeading.split(" ");

/**
 * Section 04 — HIGHLIGHTS (was Success Stories; IMPLEMENTATION.md §7, reworked).
 * A full-bleed OUR HIGHLIGHTS heading, then large project blocks. The block
 * nearest viewport centre is in focus; the others blur and dim. Each media is
 * hover-to-play (see ProjectMedia). Reduced motion: every block sharp, at rest.
 */
export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useGSAP(
    () => {
      const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setReduced(r);
      if (r) return; // heading + focus stay at rest

      // heading words rise in
      gsap.from(".ph-word", {
        yPercent: 110,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });

      // focus tracking: the block nearest centre becomes active (others blur)
      gsap.utils.toArray<HTMLElement>(".hl-item").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="projects" className="relative py-24 md:py-32">
      <Hairline className="absolute inset-x-0 top-0" />

      {/* full-width, centred heading — font-size scales with the viewport */}
      <h2 className="overflow-hidden px-4 text-center text-[13.5vw] font-display font-black uppercase leading-[0.85] tracking-normal text-ink md:px-8">
        <span className="ph-word inline-block">{HEAD_A}</span>{" "}
        <span className="ph-word inline-block">{HEAD_B}</span>
      </h2>

      <div className="shell mt-16 flex flex-col gap-28 md:mt-24 md:gap-44">
        {projects.map((p, i) => {
          const dimmed = !reduced && active !== i;
          return (
            <article
              key={p.n}
              className="hl-item flex flex-col items-center text-center transition-[filter,opacity,transform] duration-500 ease-out"
              style={{
                filter: dimmed ? "blur(6px)" : "blur(0px)",
                opacity: dimmed ? 0.45 : 1,
                transform: dimmed ? "scale(0.985)" : "scale(1)",
              }}
            >
              {/* title row */}
              <div className="mb-6 flex items-baseline justify-center gap-4">
                <span className="font-mono text-sm text-accent">{`// ${p.n}`}</span>
                <h3 className="font-display text-[clamp(32px,5vw,72px)] font-extrabold uppercase leading-none tracking-tight text-ink">
                  {p.title}
                </h3>
              </div>

              {/* media — hover reveals WATCH A VIDEO, click plays in place */}
              <div className="w-full max-w-5xl">
                <ProjectMedia image={p.image} video={p.video} title={p.title} />
              </div>

              {/* copy + stack, centred under the media */}
              <div className="mt-6 flex w-full max-w-5xl flex-col items-center gap-5">
                <p className="max-w-[62ch] text-lg leading-relaxed text-ink-2">{p.description}</p>
                <ul className="flex flex-wrap justify-center gap-2">
                  {p.stack.map((s) => (
                    <li key={s} className="badge">
                      {`// ${s}`}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
