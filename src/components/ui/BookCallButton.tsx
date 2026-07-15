"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { getCalApi } from "@calcom/embed-react";
import { booking } from "@/lib/content";

type CalApi = Awaited<ReturnType<typeof getCalApi>>;

/**
 * Booking CTA, styled as .btn.primary. It is a real link to the Cal.com booking
 * page that progressively enhances into an in-page modal.
 *
 * The embed (embed.js from app.cal.com) is loaded lazily on first hover/focus,
 * not on mount, so a normal page load stays clean even where that script is
 * blocked (extension / network / region → 404 or ERR_BLOCKED_BY_RESPONSE). Once
 * the embed is ready a click opens cal("modal"); if it never loads, the click
 * falls back to the href and opens the booking page in a new tab, so the button
 * always reaches the booking. Cal UI is themed dark with month view.
 */
export default function BookCallButton({
  children,
  className = "",
  arrow = true,
}: {
  children: ReactNode;
  className?: string;
  arrow?: boolean;
}) {
  const calRef = useRef<CalApi | null>(null);
  const warmingRef = useRef(false);
  const bookingUrl = `https://cal.com/${booking.calLink}`;

  const warmup = useCallback(async () => {
    if (warmingRef.current || calRef.current) return;
    warmingRef.current = true;
    try {
      const cal = await getCalApi({ namespace: booking.namespace });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view", theme: "dark" });
      cal("preload", { calLink: booking.calLink });
      calRef.current = cal;
    } catch (err) {
      // Embed unavailable — the href fallback still books. Allow a later retry.
      warmingRef.current = false;
      console.error("Cal.com embed unavailable; using link fallback", err);
    }
  }, []);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const cal = calRef.current;
    // getCalApi resolves with a stub even when embed.js is blocked, so a
    // non-null `cal` is not enough. embed.js sets window.Cal.instance only when
    // it actually executes — use that as the real "modal will work" signal.
    const embedReady = cal != null && typeof window !== "undefined" && window.Cal?.instance != null;
    if (!embedReady) {
      warmup(); // ready it for next time; this click opens the booking via href
      return;
    }
    e.preventDefault();
    cal("modal", {
      calLink: booking.calLink,
      config: { layout: "month_view", theme: "dark" },
    });
  }

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={warmup}
      onFocus={warmup}
      onClick={handleClick}
      className={`btn primary${className ? ` ${className}` : ""}`}
    >
      <span>{children}</span>
      {arrow && <span aria-hidden>↗</span>}
    </a>
  );
}
