import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function StubPage({
  icon: Icon,
  title,
  description,
  features,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-glow">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl gradient-brand text-white shadow-glow">
            <Icon className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-muted-foreground">{description}</p>
          </div>
          <span className="rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground">
            Rolling out
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {features.map((f) => (
          <div
            key={f}
            className="rounded-2xl border border-border/60 bg-card/60 p-5 text-sm backdrop-blur"
          >
            <div className="font-medium">{f}</div>
            <div className="mt-1 text-xs text-muted-foreground">Available soon in your region.</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/dashboard"
          className="rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
          Back to dashboard
        </Link>
        <Link
          to="/ai-assistant"
          className="rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
        >
          Ask AI Assistant
        </Link>
      </div>
    </div>
  );
}