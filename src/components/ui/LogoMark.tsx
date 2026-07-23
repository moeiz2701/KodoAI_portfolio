/**
 * The kodoAI mark, as vector. Four rounded squares on a 2x2 grid; the top-left
 * one carries the accent, the right column is welded into one shape by a bridge
 * on its left edge (which is what leaves the horizontal slit).
 *
 * Geometry mirrors scripts/brand.mjs, which renders every generated icon and
 * logo in public/ from the same numbers — keep the two in sync.
 *
 * The three neutral blocks paint with `currentColor`, so callers set the tone
 * with a text utility (`text-muted`, `text-ink`, ...). `accentClassName` exists
 * so the preloader can hang its heartbeat animation on the accent block alone.
 *
 * Note: the global `border-radius: 0 !important` rule does not reach SVG `rx`,
 * so the mark keeps its rounded blocks while the UI stays square.
 */
export default function LogoMark({
  className,
  accentClassName,
  title,
}: {
  className?: string;
  accentClassName?: string;
  /** Accessible name. Omit for decorative use (the default). */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 674 670"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g fill="currentColor">
        <rect x="350" y="0" width="324" height="324" rx="80" />
        <rect x="350" y="346" width="324" height="324" rx="80" />
        {/* Bridge: spans both corner arcs so the column's left edge stays straight. */}
        <rect x="350" y="244" width="66" height="182" />
        <rect x="0" y="346" width="324" height="324" rx="80" />
      </g>
      <rect
        className={accentClassName}
        x="0"
        y="0"
        width="324"
        height="324"
        rx="80"
        fill="var(--accent)"
      />
    </svg>
  );
}
