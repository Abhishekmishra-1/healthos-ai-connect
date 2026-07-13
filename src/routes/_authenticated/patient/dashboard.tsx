import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateHealthInsights } from "@/lib/health-ai.functions";
import {
  Sparkles, Bot, Upload, FileText, Pill, Stethoscope, FlaskConical, FolderHeart,
  Syringe, Siren, Hospital, HeartPulse, ChevronRight, Check, X, CalendarCheck,
  ShoppingBag, Loader2, Phone,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — HealthOS AI" }] }),
  component: Dashboard,
});

const quickActions = [
  { to: "/medicine", icon: Pill, label: "Medicine Delivery", tint: "from-emerald-500/20 to-teal-500/10", color: "text-emerald-500" },
  { to: "/doctors", icon: Stethoscope, label: "Doctor Consultation", tint: "from-sky-500/20 to-blue-500/10", color: "text-sky-500" },
  { to: "/labs", icon: FlaskConical, label: "Lab Tests", tint: "from-fuchsia-500/20 to-purple-500/10", color: "text-fuchsia-500" },
  { to: "/upload-prescription", icon: FileText, label: "Upload Prescription", tint: "from-amber-500/20 to-orange-500/10", color: "text-amber-500" },
  { to: "/records", icon: FolderHeart, label: "Health Records", tint: "from-rose-500/20 to-pink-500/10", color: "text-rose-500" },
  { to: "/ai-assistant", icon: Bot, label: "AI Health Assistant", tint: "from-violet-500/20 to-indigo-500/10", color: "text-violet-500" },
  { to: "/labs", icon: Syringe, label: "Vaccination", tint: "from-cyan-500/20 to-sky-500/10", color: "text-cyan-500" },
  { to: "/emergency", icon: Siren, label: "Emergency", tint: "from-red-500/20 to-orange-500/10", color: "text-red-500" },
  { to: "/doctors", icon: Hospital, label: "Nearby Hospitals", tint: "from-indigo-500/20 to-violet-500/10", color: "text-indigo-500" },
  { to: "/labs", icon: HeartPulse, label: "Health Check Packages", tint: "from-lime-500/20 to-emerald-500/10", color: "text-lime-500" },
] as const;

function greetingFor(hour: number) {
  if (hour < 5) return "Good Night";
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
}

function Dashboard() {
  const [name, setName] = useState<string>("there");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const n = ((data.user?.user_metadata as any)?.full_name ?? data.user?.email?.split("@")[0] ?? "there") as string;
      setName(n.split(" ")[0]);
    });
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const latestPrescription = useQuery({
    queryKey: ["dash", "prescription"],
    queryFn: async () => (await supabase.from("prescriptions").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle()).data,
  });
  const latestReport = useQuery({
    queryKey: ["dash", "report"],
    queryFn: async () => (await supabase.from("lab_reports").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle()).data,
  });
  const reminders = useQuery({
    queryKey: ["dash", "reminders"],
    queryFn: async () => (await supabase.from("medicine_reminders").select("*").eq("active", true).order("created_at", { ascending: false })).data ?? [],
  });
  const events = useQuery({
    queryKey: ["dash", "events"],
    queryFn: async () => (await supabase.from("health_events").select("*").order("occurred_at", { ascending: false }).limit(6)).data ?? [],
  });

  const insightsFn = useServerFn(generateHealthInsights);
  const insights = useQuery({
    queryKey: ["dash", "insights"],
    queryFn: async () => (await insightsFn({ data: undefined })).insights as string[],
    staleTime: 5 * 60_000,
  });

  // Score heuristic: 60 base + activity signals
  const score = Math.min(
    100,
    60 +
      (latestPrescription.data ? 8 : 0) +
      (latestReport.data ? 8 : 0) +
      (reminders.data?.length ? 12 : 0) +
      (events.data?.length ? Math.min(12, events.data.length * 2) : 0),
  );
  const label = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 55 ? "Needs Attention" : "Poor";
  const labelColor = score >= 85 ? "text-emerald-500" : score >= 70 ? "text-sky-500" : score >= 55 ? "text-amber-500" : "text-red-500";

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <div>
        <p className="text-sm text-muted-foreground">
          {greetingFor(now.getHours())} · {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
          Hi {name}, <span className="text-muted-foreground">how are you feeling today?</span>
        </h1>
      </div>

      {/* AI Copilot hero */}
      <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-transparent p-6 shadow-glow md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Powered by Gemini
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">Your Personal AI Health Copilot</h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">Ask anything about your health, medicines or reports. Get plain-English answers in seconds.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/ai-assistant" className="inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-90">
                <Bot className="h-4 w-4" /> Start AI Chat
              </Link>
              <Link to="/upload-report" className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-semibold backdrop-blur hover:bg-background">
                <Upload className="h-4 w-4" /> Upload Report
              </Link>
              <Link to="/upload-prescription" className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-semibold backdrop-blur hover:bg-background">
                <FileText className="h-4 w-4" /> Upload Prescription
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="animate-float grid h-32 w-32 place-items-center rounded-[2rem] gradient-brand text-white shadow-glow">
              <Bot className="h-14 w-14" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">Quick actions</h2>
          <p className="text-xs text-muted-foreground">Everything you need, one tap away</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className={`group relative flex aspect-square flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br ${a.tint} p-4 transition hover:-translate-y-1 hover:shadow-glow`}
            >
              <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-background/70 backdrop-blur ${a.color}`}>
                <a.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity + Health score */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
          <ActivityCard
            icon={CalendarCheck}
            title="Upcoming appointment"
            empty="No upcoming appointments"
            ctaHref="/appointments"
            ctaLabel="Book appointment"
            body={
              <div>
                <p className="font-medium">Dr. Priya Sharma</p>
                <p className="text-sm text-muted-foreground">General Physician · Tomorrow, 10:30 AM</p>
                <p className="mt-2 text-xs text-muted-foreground">Video consultation · ₹399</p>
              </div>
            }
          />
          <ActivityCard
            icon={ShoppingBag}
            title="Latest medicine order"
            empty="No recent orders"
            ctaHref="/orders"
            ctaLabel="View orders"
            body={
              <div>
                <p className="font-medium">Order #HOS-8241</p>
                <p className="text-sm text-muted-foreground">3 items · MedPlus Kothrud</p>
                <p className="mt-2 text-xs text-emerald-500">Out for delivery · ETA 45 min</p>
              </div>
            }
          />
          <ActivityCard
            icon={FlaskConical}
            title="Latest report"
            data={latestReport.data}
            empty="No lab reports yet"
            ctaHref="/upload-report"
            ctaLabel="Upload report"
            render={(r: any) => (
              <div>
                <p className="font-medium">{r.report_type ?? "Report"}{r.lab_name ? ` · ${r.lab_name}` : ""}</p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{r.analysis?.summary ?? (r.status === "processing" ? "Analyzing…" : "Ready to view")}</p>
                {r.analysis?.abnormal_values?.length > 0 && (
                  <p className="mt-2 text-xs text-amber-500">{r.analysis.abnormal_values.length} value{r.analysis.abnormal_values.length > 1 ? "s" : ""} to review</p>
                )}
              </div>
            )}
          />
          <ActivityCard
            icon={Pill}
            title="Pending reminder"
            data={reminders.data?.[0]}
            empty="No active reminders"
            ctaHref="/reminders"
            ctaLabel="Add reminder"
            render={(m: any) => (
              <div>
                <p className="font-medium">{m.medicine_name}</p>
                <p className="text-sm text-muted-foreground">{m.dosage} · {m.frequency}</p>
                {m.times?.length > 0 && <p className="mt-2 text-xs text-muted-foreground">Next at {m.times[0]}</p>}
              </div>
            )}
          />
        </div>

        <HealthScoreCard score={score} label={label} labelColor={labelColor} insights={insights.data ?? []} loading={insights.isLoading} />
      </section>

      {/* Today's medicines */}
      <TodayMedicines reminders={reminders.data ?? []} loading={reminders.isLoading} />

      {/* Health timeline preview */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">Health timeline</h2>
          <Link to="/timeline" className="text-sm font-semibold gradient-brand-text">View all →</Link>
        </div>
        {events.data?.length ? (
          <ol className="relative ml-3 space-y-4 border-l border-border pl-6">
            {events.data.map((e: any) => (
              <li key={e.id} className="relative">
                <span className="absolute -left-[30px] grid h-6 w-6 place-items-center rounded-full gradient-brand text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <p className="text-xs text-muted-foreground">{new Date(e.occurred_at).toLocaleString()}</p>
                  <p className="mt-1 text-sm font-medium">{e.title}</p>
                  {e.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{e.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-3xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">Your timeline will show prescriptions, reports, vaccinations and doctor visits chronologically.</p>
            <Link to="/upload-prescription" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold gradient-brand-text">
              Add your first record <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Emergency footer */}
      <div className="flex flex-col gap-4 rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-orange-500/5 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-500">Emergency</p>
          <h3 className="mt-1 text-lg font-semibold">Need urgent help?</h3>
          <p className="mt-1 text-sm text-muted-foreground">One-tap SOS, ambulance, nearby hospitals and blood banks.</p>
        </div>
        <div className="flex gap-2">
          <a href="tel:108" className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-red-600">
            <Phone className="h-4 w-4" /> Call 108
          </a>
          <Link to="/emergency" className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10">
            Open Emergency
          </Link>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ icon: Icon, title, data, body, empty, render, ctaHref, ctaLabel }: any) {
  const content = body ?? (data ? render?.(data) : <p className="text-sm text-muted-foreground">{empty}</p>);
  return (
    <div className="group flex flex-col rounded-3xl border border-border/60 bg-card p-5 shadow-sm transition hover:shadow-glow">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-secondary"><Icon className="h-4 w-4" /></span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="mt-3 flex-1">{content}</div>
      <Link to={ctaHref} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold gradient-brand-text">
        {ctaLabel} <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function HealthScoreCard({ score, label, labelColor, insights, loading }: any) {
  const radius = 68;
  const c = 2 * Math.PI * radius;
  const dash = (score / 100) * c;
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-2xl gradient-brand text-white shadow-glow"><HeartPulse className="h-4 w-4" /></span>
        <h3 className="text-sm font-semibold">Health Score</h3>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <div className="relative grid place-items-center">
          <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
            <circle cx="90" cy="90" r={radius} strokeWidth="14" className="fill-none stroke-secondary" />
            <circle
              cx="90" cy="90" r={radius} strokeWidth="14" strokeLinecap="round"
              className="fill-none"
              stroke="url(#hs-grad)"
              strokeDasharray={`${dash} ${c}`}
            />
            <defs>
              <linearGradient id="hs-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.55 0.22 268)" />
                <stop offset="100%" stopColor="oklch(0.62 0.24 300)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-4xl font-semibold tracking-tight">{score}</p>
              <p className="text-xs text-muted-foreground">/ 100</p>
            </div>
          </div>
        </div>
        <p className={`mt-2 text-sm font-semibold ${labelColor}`}>{label}</p>
      </div>
      <div className="mt-4 space-y-2 text-xs">
        {loading && <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Generating insights…</p>}
        {insights.length > 0
          ? insights.slice(0, 3).map((i: string, idx: number) => (
              <p key={idx} className="rounded-2xl bg-secondary/60 px-3 py-2">✨ {i}</p>
            ))
          : !loading && <p className="text-muted-foreground">Upload a prescription or report to unlock personalized insights.</p>}
      </div>
    </div>
  );
}

function TodayMedicines({ reminders, loading }: { reminders: any[]; loading: boolean }) {
  const [taken, setTaken] = useState<Record<string, "taken" | "skipped">>({});
  const today = reminders.flatMap((r) => (r.times ?? []).map((t: string) => ({ ...r, time: t, key: `${r.id}-${t}` })));
  today.sort((a: any, b: any) => a.time.localeCompare(b.time));

  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-lg font-semibold tracking-tight md:text-xl">Today's medicines</h2>
        <Link to="/reminders" className="text-sm font-semibold gradient-brand-text">Manage →</Link>
      </div>
      {loading ? (
        <div className="grid gap-2">
          {[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-secondary/50" />)}
        </div>
      ) : today.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No medicines scheduled today. Add reminders to stay on track.
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {today.map((m: any) => {
            const state = taken[m.key];
            return (
              <div key={m.key} className={`flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 pl-4 ${state ? "opacity-60" : ""}`}>
                <div className="w-14 text-sm font-semibold tabular-nums">{m.time}</div>
                <span className="grid h-9 w-9 place-items-center rounded-2xl gradient-brand text-white"><Pill className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.medicine_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.dosage}{m.food_timing ? ` · ${m.food_timing}` : ""}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setTaken((s) => ({ ...s, [m.key]: "taken" }))}
                    className={`grid h-8 w-8 place-items-center rounded-full transition ${state === "taken" ? "bg-emerald-500 text-white" : "bg-secondary hover:bg-emerald-500/20 hover:text-emerald-500"}`}
                    aria-label="Taken"
                  ><Check className="h-4 w-4" /></button>
                  <button
                    onClick={() => setTaken((s) => ({ ...s, [m.key]: "skipped" }))}
                    className={`grid h-8 w-8 place-items-center rounded-full transition ${state === "skipped" ? "bg-red-500 text-white" : "bg-secondary hover:bg-red-500/20 hover:text-red-500"}`}
                    aria-label="Skip"
                  ><X className="h-4 w-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}