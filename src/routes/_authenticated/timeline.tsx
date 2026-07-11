import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, FlaskConical, Pill, Circle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/timeline")({
  head: () => ({ meta: [{ title: "Health Timeline — HealthOS AI" }] }),
  component: Timeline,
});

const iconFor: Record<string, any> = {
  prescription: FileText,
  lab_report: FlaskConical,
  reminder: Pill,
  note: Circle,
};

function Timeline() {
  const events = useQuery({
    queryKey: ["timeline"],
    queryFn: async () => {
      const { data } = await supabase.from("health_events").select("*").order("occurred_at", { ascending: false }).limit(100);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Health Timeline</h1>
        <p className="mt-2 text-sm text-muted-foreground">Every prescription, report, and health event in one chronological view.</p>
      </div>

      {events.data?.length ? (
        <ol className="relative ml-3 space-y-6 border-l border-border pl-6">
          {events.data.map((e: any) => {
            const Icon = iconFor[e.event_type] ?? Circle;
            return (
              <li key={e.id} className="relative">
                <span className="absolute -left-[34px] grid h-8 w-8 place-items-center rounded-full gradient-brand text-white shadow-glow">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <p className="text-xs text-muted-foreground">{new Date(e.occurred_at).toLocaleString()}</p>
                  <p className="mt-1 font-medium">{e.title}</p>
                  {e.description && <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-sm text-muted-foreground">Your timeline is empty. Upload a prescription or report to get started.</p>
      )}
    </div>
  );
}