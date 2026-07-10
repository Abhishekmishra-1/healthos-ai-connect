import type { ReactNode } from "react";
import { PageShell, PageHeader } from "./page-shell";

export function SimplePage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <PageShell>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="mx-auto max-w-4xl px-6 pb-24">{children}</div>
    </PageShell>
  );
}