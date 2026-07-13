import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, FlaskConical, Syringe, Camera, LayoutGrid, List, Upload, Download, Share2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/records")({
  head: () => ({ meta: [{ title: "Health Records — HealthOS AI" }] }),
  component: RecordsPage,
});

const TABS = [
  { key: "all", label: "All", icon: LayoutGrid },
  { key: "prescriptions", label: "Prescriptions", icon: FileText },
  { key: "reports", label: "Reports", icon: FlaskConical },
  { key: "vaccinations", label: "Vaccinations", icon: Syringe },
  { key: "scans", label: "Scans", icon: Camera },
] as const;

export function RecordsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const prescriptions = useQuery({
    queryKey: ["records", "prescriptions"],
    queryFn: async () => (await supabase.from("prescriptions").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const reports = useQuery({
    queryKey: ["records", "reports"],
    queryFn: async () => (await supabase.from("lab_reports").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const items = [
    ...(tab === "all" || tab === "prescriptions" ? (prescriptions.data ?? []).map((p: any) => ({ ...p, _type: "prescription" as const })) : []),
    ...(tab === "all" || tab === "reports" ? (reports.data ?? []).map((r: any) => ({ ...r, _type: "report" as const })) : []),
  ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Health Records</h1>
          <p className="mt-2 text-sm text-muted-foreground">All your prescriptions, reports, scans and vaccinations, in one place.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/patient/upload-prescription" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary">
            <Upload className="h-4 w-4" /> Prescription
          </Link>
          <Link to="/patient/upload-report" className="inline-flex items-center gap-2 rounded-full gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow">
            <Upload className="h-4 w-4" /> Report
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${tab === t.key ? "gradient-brand text-white shadow-glow" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          ))}
        </div>
        <div className="flex rounded-full border border-border/60 bg-card p-1">
          <button onClick={() => setView("grid")} className={`grid h-8 w-8 place-items-center rounded-full ${view === "grid" ? "bg-secondary" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
          <button onClick={() => setView("list")} className={`grid h-8 w-8 place-items-center rounded-full ${view === "list" ? "bg-secondary" : ""}`}><List className="h-4 w-4" /></button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">No records yet in this category.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((r: any) => <RecordCard key={`${r._type}-${r.id}`} r={r} />)}
        </div>
      ) : (
        <div className="divide-y divide-border/60 rounded-3xl border border-border/60 bg-card">
          {items.map((r: any) => (
            <div key={`${r._type}-${r.id}`} className="flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary">
                {r._type === "prescription" ? <FileText className="h-4 w-4" /> : <FlaskConical className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {r._type === "prescription" ? r.doctor_name ? `Dr. ${r.doctor_name}` : "Prescription" : r.report_type ?? "Report"}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><Download className="h-4 w-4" /></button>
              <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><Share2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecordCard({ r }: { r: any }) {
  const isP = r._type === "prescription";
  return (
    <div className="flex flex-col rounded-3xl border border-border/60 bg-card p-5 transition hover:shadow-glow">
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-2xl ${isP ? "bg-amber-500/10 text-amber-500" : "bg-fuchsia-500/10 text-fuchsia-500"}`}>
          {isP ? <FileText className="h-4 w-4" /> : <FlaskConical className="h-4 w-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {isP ? (r.doctor_name ? `Dr. ${r.doctor_name}` : "Prescription") : (r.report_type ?? "Lab Report")}
          </p>
          <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-xs text-muted-foreground">{r.analysis?.summary ?? (r.status === "processing" ? "Analyzing…" : "Ready")}</p>
      <div className="mt-4 flex justify-end gap-1">
        <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><Download className="h-4 w-4" /></button>
        <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><Share2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
}