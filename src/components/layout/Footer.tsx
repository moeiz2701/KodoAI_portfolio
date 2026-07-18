"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { finalCta, footer, site, socials } from "@/lib/content";
import BookCallButton from "@/components/ui/BookCallButton";
import DotMatrix from "@/components/canvas/DotMatrix";

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer (IMPLEMENTATION.md §10). Same living-banner DNA as the hero, quieter
 * (intensity 0.45), with a staggered fade-up reveal of its blocks. (The full
 * sticky "curtain" lift is a Phase 6 polish item — it needs visual tuning.)
 *
 * The footer is shared by the homepage and case study subpages. Its section
 * anchors (`#quotation`, …) only exist on the homepage, so off "/" they are
 * rewritten to `/#section` — the browser navigates home then scrolls there.
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const onHome = pathname === "/";
  // On the homepage, keep bare `#anchors` so Lenis smooth-scrolls in place.
  const navHref = (href: string) => (onHome || !href.startsWith("#") ? href : `/${href}`);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return; // blocks render at rest
      // Final CTA reads first: its own, slightly larger entrance on enter.
      gsap.from(".cta-reveal", {
        opacity: 0,
        y: 32,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".footer-cta", start: "top 85%", once: true },
      });
      gsap.from(".footer-block", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".footer-grid", start: "top 85%", once: true },
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
      {/* Living banner behind everything, at the same intensity + grid density
          as the hero so it reads just as apparent. The footer canvas is tall, so
          it keeps the perf knobs that DON'T change how the cloud looks (capped
          fps, slightly lower backing resolution, no cursor tracking). */}
      <DotMatrix intensity={1} fps={30} maxDpr={1.5} interactive={false} />
      {/* minimal accent glow for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(90% 60% at 50% 0%, var(--accent-glow), transparent 70%)" }}
      />
      <div className="relative z-10">
        {/* Final CTA — the footer extends up to carry this, one shared surface */}
        <div className="footer-cta shell py-28 md:py-40">
          <p className="cta-reveal eyebrow">{finalCta.eyebrow}</p>
          <h2 className="cta-reveal mt-8 max-w-[18ch] font-display text-[clamp(44px,7.5vw,112px)] font-extrabold uppercase leading-[0.92] tracking-tight text-ink">
            {finalCta.lead}{" "}
            <span className="text-accent">{finalCta.accent}</span>
          </h2>
          <div className="cta-reveal mt-12">
            <BookCallButton>{finalCta.ctaLabel}</BookCallButton>
          </div>
        </div>

        <div className="shell">
          <div className="h-px w-full bg-border" aria-hidden />
        </div>

        <div className="footer-grid shell pb-6 pt-20 md:pb-8 md:pt-28">
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
                    href={navHref(l.href)}
                    className="nav-fill block px-3 py-3 font-display text-5xl font-extrabold uppercase leading-none tracking-tight text-ink md:text-6xl"
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
            <ul className="mb-6 flex flex-col gap-2 font-mono text-sm text-ink-2">
              {footer.sites.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
            <div className="mb-10 text-ink-3">
              {site.location.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="eyebrow mb-3">{footer.ctaEyebrow}</p>
            <BookCallButton>{footer.ctaLabel}</BookCallButton>
          </div>

          {/* SOCIALS */}
          <div className="footer-block">
            <p className="eyebrow mb-6">{footer.socialsHeading}</p>
            <ul className="flex flex-col gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
            <a href={navHref("#top")} className="transition-colors hover:text-accent">
              {footer.backToTop} ↑
            </a>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
