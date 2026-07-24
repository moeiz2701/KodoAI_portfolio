"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { blurDataURL } from "@/lib/placeholder";

gsap.registerPlugin(ScrollTrigger);

/**
 * Project media (IMPLEMENTATION.md §7.3, adapted).
 * Poster image first; the WATCH A VIDEO pill fades up on hover. On touch devices
 * or mobile-width screens (no hover to reveal it) the pill stays pinned so those
 * users always see the affordance. Clicking / tapping plays the Cloudinary clip
 * in place (one user gesture, so it may autoplay).
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
  // Touch devices OR mobile-width screens (< md, 768px) pin the overlay so the
  // WATCH affordance is always visible there — no hover to reveal it.
  const [alwaysShow, setAlwaysShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (max-width: 767px)");
    const update = () => setAlwaysShow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
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
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              placeholder="blur"
              blurDataURL={blurDataURL}
              className="object-cover grayscale contrast-[1.05] brightness-[0.62]"
            />
          </span>
          {/* mono treatment: the grayscale poster takes a slight accent-green cast
              (mix-blend color tints the darkened image without lifting it). */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "var(--accent)", mixBlendMode: "color", opacity: 0.18 }}
          />
          {/* scrim + pill — hover-revealed on pointer devices, always shown on touch / mobile width */}
          <span
            className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${
              alwaysShow ? "bg-bg/25" : "bg-bg/0 group-hover:bg-bg/25"
            }`}
          >
            <span
              className={`btn primary transition-all duration-300 ease-out ${
                alwaysShow
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
