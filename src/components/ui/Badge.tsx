import type { ReactNode } from "react";

/** .badge from DesignSystem.md §5.3. */
export default function Badge({
  children,
  accent,
  className = "",
}: {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span className={`badge${accent ? " accent" : ""}${className ? ` ${className}` : ""}`}>
      {children}
    </span>
  );
}
