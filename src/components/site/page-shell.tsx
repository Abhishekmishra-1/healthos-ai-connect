import type { ReactNode } from "react";
import { SiteNav } from "./nav";
import { SiteFooter } from "./footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] gradient-mesh" />
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-16 pt-40 text-center md:pt-48">
      {eyebrow && (
        <span className="inline-flex items-center rounded-full glass px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
          {eyebrow}
        </span>
      )}
      <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight md:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </section>
  );
}