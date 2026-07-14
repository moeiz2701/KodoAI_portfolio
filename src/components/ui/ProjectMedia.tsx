"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Project media (IMPLEMENTATION.md §7.3, adapted).
 * Poster image first; the WATCH A VIDEO pill fades up on hover, and where hover
 * isn't available (touch) it stays shown so mobile users see the affordance.
 * Clicking / tapping plays the Cloudinary clip in place (one user gesture, so
 * it may autoplay).
 *
 * The poster sits on an over-sized layer that drifts vertically with scroll
 * (parallax); the drift lives on that layer, not the image. Re-runs on toggle.
 */
export default function ProjectMedia({
  image,
  video,
  title,
}: {
  image: string;
  video: string;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [noHover, setNoHover] = useState(false); // touch → show overlay always

  useEffect(() => {
    setNoHover(window.matchMedia("(hover: none)").matches);
  }, []);

  useGSAP(
    () => {
      if (playing) return; // no poster to parallax while the video plays
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const layer = ref.current?.querySelector(".hl-parallax");
      if (!layer) return;

      gsap.fromTo(
        layer,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [playing] },
  );

  return (
    <div
      ref={ref}
      className="group relative aspect-video w-full overflow-hidden border border-border bg-surface-2"
    >
      {playing ? (
        <video
          src={video}
          autoPlay
          controls
          playsInline
          onEnded={() => setPlaying(false)}
          className="h-full w-full object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Watch the ${title} demo`}
          className="absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* over-sized layer (120% tall) so the parallax drift never bares an edge */}
          <span className="hl-parallax absolute inset-x-0 -top-[10%] block h-[120%]">
            <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 1024px" className="object-cover" />
          </span>
          {/* scrim + pill — hover-revealed on pointer devices, always shown on touch */}
          <span
            className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${
              noHover ? "bg-bg/25" : "bg-bg/0 group-hover:bg-bg/25"
            }`}
          >
            <span
              className={`btn primary transition-all duration-300 ease-out ${
                noHover
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
              }`}
            >
              ▶ WATCH A VIDEO
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
