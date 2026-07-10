import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  primary?: boolean;
  arrow?: boolean;
  className?: string;
  ariaLabel?: string;
};

/**
 * .btn / .btn.primary from DesignSystem.md §5.1.
 * Magnetic hover (MagneticWrap) is layered on in Phase 6.
 */
export default function Button({ children, href, primary, arrow, className = "", ariaLabel }: Props) {
  const cls = `btn${primary ? " primary" : ""}${className ? ` ${className}` : ""}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && <span aria-hidden>↗</span>}
    </>
  );

  if (href) {
    // In-page anchors use a plain <a> (Lenis anchor scroll is wired in Phase 3).
    if (href.startsWith("#") || href.startsWith("mailto:")) {
      return (
        <a href={href} className={cls} aria-label={ariaLabel}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
