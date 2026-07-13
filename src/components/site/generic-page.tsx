import { PageHero, Section, StatCard } from "@/components/site/role-shell";
import type { LucideIcon } from "lucide-react";

export function GenericPage({
  icon,
  title,
  description,
  stats = [],
  items = [],
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  stats?: { label: string; value: string; sub?: string; icon: LucideIcon }[];
  items?: { title: string; meta: string; status?: string }[];
}) {
  return (
    <div>
      <PageHero icon={icon} title={title} description={description} />
      {stats.length > 0 && (
        <div className="grid gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      )}
      <Section title="Recent activity">
        <ul className="divide-y divide-border/40">
          {items.map((it, i) => (
            <li key={i} className="flex items-center justify-between gap-4 py-3">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-xs text-muted-foreground">{it.meta}</div>
              </div>
              {it.status && (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{it.status}</span>
              )}
            </li>
          ))}
          {items.length === 0 && <li className="py-6 text-sm text-muted-foreground">No activity yet.</li>}
        </ul>
      </Section>
    </div>
  );
}