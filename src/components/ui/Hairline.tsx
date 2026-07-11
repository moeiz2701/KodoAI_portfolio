"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * 1px rule that draws itself left-to-right when it enters (animation A15).
 * Defaults to full width so it stays visible without JS / under reduced motion;
 * GSAP sets scaleX:0 before paint (useLayoutEffect) then animates to 1.
 */
export default function Hairline({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      gsap.from(ref.current, {
        scaleX: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { scope: ref },
  );

  return <div ref={ref} className={`h-px w-full origin-left bg-border ${className}`} aria-hidden />;
}
