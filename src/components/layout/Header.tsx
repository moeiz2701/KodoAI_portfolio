"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { nav, site, type NavLink } from "@/lib/content";
import { useLoaded } from "@/lib/loaded";
import Button from "@/components/ui/Button";
import LogoMark from "@/components/ui/LogoMark";
import MobileNav from "@/components/layout/MobileNav";

/**
 * Fixed nav (IMPLEMENTATION.md §3.4). Below md the desktop nav + CTA give way to
 * a hamburger (<MobileNav>) that opens a full-screen, footer-styled menu.
 *
 * Items (`.header-item`) drop in with a stagger once the preloader lifts, in the
 * same beat as the hero wordmark + description. GSAP drives inline opacity /
 * transform, so it never clashes with the `.nav-fill` colour transition or the
 * `.btn` transitions. Reduced motion early-returns → items stay put, visible.
 *
 * `links` / `logoHref` default to the single-page anchor nav; case study pages
 * pass a single HOME link (→ "/") so subpages share the exact same header.
 */
export default function Header({
  links = nav,
  logoHref = "#top",
}: {
  links?: NavLink[];
  logoHref?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const loaded = useLoaded();

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      // Hold items hidden on every run so the re-run on `loaded` animates from
      // this hidden state to visible (see the same note in Hero).
      gsap.set(".header-item", { autoAlpha: 0, y: -14 });
      if (!loaded) return; // held under the preloader

      gsap.to(".header-item", {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
      });
    },
    { dependencies: [loaded], scope: root },
  );

  return (
    <header ref={root} className="fixed inset-x-0 top-0 z-40">
      <div className="flex items-center justify-between px-6 py-6 md:px-12">
        {/* logo mark */}
        <a href={logoHref} className="header-item flex items-center" aria-label={`${site.name} home`}>
          <LogoMark title={site.name} className="h-9 w-auto text-muted md:h-10" />
        </a>

        {/* center nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="header-item eyebrow nav-fill px-3 py-2">
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA — desktop only; the hamburger takes its place below md */}
        <Button href={site.cta.href} primary arrow className="header-item hidden md:inline-flex">
          {site.cta.label}
        </Button>

        {/* Mobile hamburger + full-screen menu */}
        <MobileNav links={links} homeHref={logoHref} />
      </div>
    </header>
  );
}
