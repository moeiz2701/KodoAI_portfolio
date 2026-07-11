"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { footer, site, socials } from "@/lib/content";
import Button from "@/components/ui/Button";
import DotMatrix from "@/components/canvas/DotMatrix";

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer (IMPLEMENTATION.md §10). Same living-banner DNA as the hero, quieter
 * (intensity 0.45), with a staggered fade-up reveal of its blocks. (The full
 * sticky "curtain" lift is a Phase 6 polish item — it needs visual tuning.)
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return; // blocks render at rest
      gsap.from(".footer-block", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <footer
      ref={root}
      id="footer"
      className="relative overflow-hidden border-t border-border bg-surface"
    >
      {/* low-intensity living banner behind everything */}
      <DotMatrix intensity={0.45} />
      <div className="relative z-10 shell py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-3">
          {/* NAVIGATION */}
          <div className="footer-block">
            <p className="eyebrow mb-6 flex items-center gap-2">
              <span className="h-[8px] w-[8px] bg-accent" aria-hidden />
              {footer.navHeading}
            </p>
            <ul className="flex flex-col">
              {footer.nav.map((l) => (
                <li key={l.href} className="border-b border-dashed border-border">
                  <a
                    href={l.href}
                    className="block py-3 font-display text-5xl font-extrabold uppercase leading-none tracking-tight text-ink transition-colors hover:text-accent md:text-6xl"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* STUDIO DETAILS */}
          <div className="footer-block">
            <p className="eyebrow mb-6">{footer.detailsHeading}</p>
            <p className="mb-6 font-mono text-ink-2">
              <span className="text-accent">↳ </span>
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink">
                {site.email}
              </a>
            </p>
            <div className="mb-10 text-ink-3">
              {site.location.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="eyebrow mb-3">{footer.ctaEyebrow}</p>
            <Button href="#footer" primary arrow>
              {footer.ctaLabel}
            </Button>
          </div>

          {/* SOCIALS */}
          <div className="footer-block">
            <p className="eyebrow mb-6">{footer.socialsHeading}</p>
            <ul className="flex flex-col gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="font-mono text-sm uppercase tracking-widest text-ink-2 transition-colors hover:text-accent"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* hairline + bottom bar */}
        <div className="footer-block">
          <div className="mt-16 h-px w-full bg-border" aria-hidden />
          <div className="mt-6 flex flex-col gap-3 font-mono text-[11px] uppercase tracking-widest text-ink-3 md:flex-row md:items-center md:justify-between">
            <span>{footer.copyright}</span>
            <span className="text-muted">{footer.tagline}</span>
            <a href="#top" className="transition-colors hover:text-accent">
              {footer.backToTop} ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
