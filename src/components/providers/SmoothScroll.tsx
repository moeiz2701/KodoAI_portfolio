"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll synced to the GSAP ticker (IMPLEMENTATION.md §3.1).
 * Disabled entirely for prefers-reduced-motion users — native scroll only.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null);
  const [reduced, setReduced] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Start every top-level page at the top. Lenis keeps its own scroll offset
  // across client navigations, so a nav from deep in the (tall) homepage would
  // otherwise land the new, shorter page mid-way — on a case study, at the
  // footer. Skip when navigating to an anchor (e.g. /#services) so the footer's
  // "go home to a section" links still scroll where they should.
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) return;
    const lenis = lenisRef.current?.lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (reduced) return;
    const lenis = lenisRef.current?.lenis;
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    // Keep ScrollTrigger in lockstep with Lenis so scrubbed timelines don't lag.
    lenis?.on?.("scroll", ScrollTrigger.update);
    return () => {
      gsap.ticker.remove(update);
      lenis?.off?.("scroll", ScrollTrigger.update);
    };
  }, [reduced]);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false, // GSAP ticker drives it
        lerp: 0.09, // heavy, luxurious feel
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        anchors: true, // in-page #links smooth-scroll instead of jumping
      }}
    >
      {children}
    </ReactLenis>
  );
}
