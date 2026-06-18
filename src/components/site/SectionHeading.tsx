import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto mb-14" : "max-w-2xl mb-14"}>
      {eyebrow && <div className="text-eyebrow mb-4">{eyebrow}</div>}
      <h2 className="heading-display text-4xl md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-5 text-base text-muted-foreground leading-relaxed">{subtitle}</p>}
      {children}
    </div>
  );
}
