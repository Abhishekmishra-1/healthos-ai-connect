import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateHealthInsights } from "@/lib/health-ai.functions";
import { FileText, FlaskConical, Pill, Sparkles, Phone, ChevronRight, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({ meta: [{ title: "Dashboard — HealthOS AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setName((data.user?.user_metadata as any)?.full_name ?? data.user?.email?.split("@")[0] ?? "there");
    });
  }, []);

  const latestPrescription = useQuery({
    queryKey: ["dash", "prescription"],
    queryFn: async () => {
      const { data } = await supabase.from("prescriptions").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
  });
  const latestReport = useQuery({
    queryKey: ["dash", "report"],
    queryFn: async () => {
      const { data } = await supabase.from("lab_reports").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
  });
  const nextReminder = useQuery({
    queryKey: ["dash", "reminder"],
    queryFn: async () => {
      const { data } = await supabase.from("medicine_reminders").select("*").eq("active", true).order("created_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
  });

  const insightsFn = useServerFn(generateHealthInsights);
  const insights = useQuery({
    queryKey: ["dash", "insights"],
    queryFn: async () => (await insightsFn({ data: undefined })).insights as string[],
    staleTime: 5 * 60_000,
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Hi {name} 👋</h1>
      </div>

      <EmergencyCard />

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          icon={FileText}
          title="Latest prescription"
          empty="No prescriptions yet"
          ctaHref="/app/upload-prescription"
          ctaLabel="Upload prescription"
          data={latestPrescription.data}
          render={(p: any) => (
            <div>
              <p className="text-sm text-muted-foreground">{p.doctor_name ? `Dr. ${p.doctor_name}` : "Doctor"}{p.clinic_name ? ` · ${p.clinic_name}` : ""}</p>
              <p className="mt-1 text-sm">{p.analysis?.summary ?? (p.status === "processing" ? "Analyzing…" : "Ready")}</p>
              {p.analysis?.medicines?.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">{p.analysis.medicines.length} medicine{p.analysis.medicines.length > 1 ? "s" : ""} extracted</p>
              )}
            </div>
          )}
        />
        <Card
          icon={FlaskConical}
          title="Latest lab report"
          empty="No reports yet"
          ctaHref="/app/upload-report"
          ctaLabel="Upload report"
          data={latestReport.data}
          render={(r: any) => (
            <div>
              <p className="text-sm text-muted-foreground">{r.report_type ?? "Report"}{r.lab_name ? ` · ${r.lab_name}` : ""}</p>
              <p className="mt-1 text-sm">{r.analysis?.summary ?? (r.status === "processing" ? "Analyzing…" : "Ready")}</p>
              {r.analysis?.abnormal_values?.length > 0 && (
                <p className="mt-2 text-xs text-amber-500">{r.analysis.abnormal_values.length} value{r.analysis.abnormal_values.length > 1 ? "s" : ""} to review</p>
              )}
            </div>
          )}
        />
        <Card
          icon={Pill}
          title="Upcoming reminder"
          empty="No active reminders"
          ctaHref="/app/reminders"
          ctaLabel="Add reminder"
          data={nextReminder.data}
          render={(m: any) => (
            <div>
              <p className="text-base font-medium">{m.medicine_name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{m.dosage} · {m.frequency}{m.food_timing ? ` · ${m.food_timing}` : ""}</p>
              {m.times?.length > 0 && <p className="mt-2 text-xs text-muted-foreground">At {m.times.join(", ")}</p>}
            </div>
          )}
        />
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl gradient-brand text-white shadow-glow"><Sparkles className="h-4 w-4" /></span>
            <h3 className="text-base font-semibold">AI health insights</h3>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            {insights.isLoading && <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Thinking…</p>}
            {insights.data && insights.data.length > 0 ? (
              insights.data.map((i, idx) => (
                <p key={idx} className="rounded-2xl bg-secondary/60 px-3 py-2">{i}</p>
              ))
            ) : (
              !insights.isLoading && <p className="text-muted-foreground">Upload a prescription or report to unlock personalized insights.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, data, empty, render, ctaHref, ctaLabel }: any) {
  return (
    <div className="group rounded-3xl border border-border/60 bg-card p-6 shadow-sm transition hover:shadow-glow">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary"><Icon className="h-4 w-4" /></span>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <div className="mt-4 min-h-[64px]">
        {data ? render(data) : <p className="text-sm text-muted-foreground">{empty}</p>}
      </div>
      <Link to={ctaHref} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold gradient-brand-text">
        {ctaLabel} <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function EmergencyCard() {
  const [sharing, setSharing] = useState(false);
  async function share() {
    setSharing(true);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
      );
      const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
      if (navigator.share) {
        await navigator.share({ title: "My location — emergency", url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Location copied: " + url);
      }
    } catch {
      /* ignore */
    } finally {
      setSharing(false);
    }
  }
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-orange-500/5 p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold text-red-500">Emergency</p>
        <h3 className="mt-1 text-lg font-semibold">Need urgent help?</h3>
        <p className="mt-1 text-sm text-muted-foreground">Call 108 for ambulance. Share your live location with your emergency contact.</p>
      </div>
      <div className="flex gap-2">
        <a href="tel:108" className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-red-600">
          <Phone className="h-4 w-4" /> Call 108
        </a>
        <button onClick={share} disabled={sharing} className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-60">
          {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Share location"}
        </button>
      </div>
    </div>
  );
}