import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import {
  Sparkles, Pill, Stethoscope, FlaskConical, LayoutDashboard, ShieldCheck, ArrowRight,
  TrendingUp, Users, Package, Calendar, FileText, Activity, IndianRupee, Clock,
} from "lucide-react";
import type { ReactNode } from "react";

type DemoKind = "ai-assistant" | "patient" | "pharmacy" | "doctor" | "lab" | "admin";

const config: Record<DemoKind, {
  eyebrow: string;
  title: string;
  description: string;
  meta: string;
}> = {
  "ai-assistant": {
    eyebrow: "Product demo",
    title: "Aarogya — the AI health assistant",
    description: "Ask in Hindi or English. Understand any prescription, report or symptom in seconds.",
    meta: "See how MEDOOGLE AI answers health questions in Hindi and English with safety-first design.",
  },
  patient: {
    eyebrow: "Patient app",
    title: "Your entire healthcare, in one app",
    description: "The consumer experience that 1.2M+ Indian families use every day.",
    meta: "A tour of the MEDOOGLE patient app: records, medicines, doctors, and emergency.",
  },
  pharmacy: {
    eyebrow: "Pharmacy dashboard",
    title: "Run your chemist shop on MEDOOGLE",
    description: "Digital billing, inventory, and instant access to patients in your locality.",
    meta: "Inventory, orders, analytics — the pharmacy dashboard powering 8,400+ partners.",
  },
  doctor: {
    eyebrow: "Doctor dashboard",
    title: "Practice management, reimagined",
    description: "Appointments, patient history, digital prescriptions, video consults — free to start.",
    meta: "Appointments, prescriptions and video consults in one clinical dashboard.",
  },
  lab: {
    eyebrow: "Lab dashboard",
    title: "Grow your lab across every neighborhood",
    description: "Sample collection scheduling, report upload, and AI patient summaries built in.",
    meta: "Sample scheduling, reports, and analytics for pathology labs on MEDOOGLE.",
  },
  admin: {
    eyebrow: "Admin dashboard",
    title: "Command center for the network",
    description: "Manage users, partners, orders, revenue and network-wide analytics.",
    meta: "The internal command center for the MEDOOGLE AI healthcare network.",
  },
};

export const Route = createFileRoute("/demo/$kind")({
  beforeLoad: ({ params }) => {
    if (!(params.kind in config)) throw notFound();
  },
  head: ({ params }) => {
    const k = params.kind as DemoKind;
    const c = config[k] ?? config["patient"];
    return {
      meta: [
        { title: `${c.title} — MEDOOGLE AI` },
        { name: "description", content: c.meta },
        { property: "og:title", content: c.title },
        { property: "og:description", content: c.meta },
      ],
    };
  },
  component: DemoPage,
});

function DemoPage() {
  const { kind } = Route.useParams();
  const k = kind as DemoKind;
  const c = config[k];

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-40 text-center md:pt-48">
        <span className="inline-flex items-center rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground">
          {c.eyebrow}
        </span>
        <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight md:text-6xl">{c.title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">{c.description}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-[2rem] glass p-6 shadow-glow md:p-10">
          <DemoContent kind={k} />
        </div>
        <div className="mt-10 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow">
            Request a full walkthrough <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function StatTile({ icon: Icon, k, v }: { icon: React.ComponentType<{ className?: string }>; k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-5">
      <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-white">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{k}</p>
      <p className="text-xs text-muted-foreground">{v}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function DemoContent({ kind }: { kind: DemoKind }) {
  if (kind === "ai-assistant") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl gradient-brand text-white"><Sparkles className="h-4 w-4" /></span>
            <div>
              <p className="text-sm font-semibold">Aarogya AI</p>
              <p className="text-xs text-muted-foreground">Multilingual · safety-first</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-secondary px-4 py-2.5">
              What does "eGFR 68" mean in my kidney report?
            </div>
            <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
              eGFR (estimated Glomerular Filtration Rate) measures how well your kidneys filter waste.
              68 is mildly reduced. Normal is 90+. It's not urgent but worth discussing with a doctor
              — I can book <span className="font-medium text-foreground">Dr. Menon (Nephrology, 3.2 km)</span> for tomorrow morning?
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-secondary px-4 py-2.5">
              हाँ book कर दो
            </div>
            <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
              Booked ✓ Tomorrow 10:30 AM. मैंने आपकी report Dr. Menon को भेज दी है.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (kind === "patient") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <StatTile icon={Activity} k="92" v="Health score" />
        <StatTile icon={Calendar} k="Tomorrow" v="Next appointment" />
        <StatTile icon={Pill} k="4 active" v="Medicines" />
        <Panel title="Today's medicines">
          <ul className="space-y-2 text-sm">
            {[["Amlodipine 5mg","8:00 AM ✓"],["Metformin 500mg","1:00 PM"],["Atorvastatin 10mg","9:30 PM"]].map(([m,t]) => (
              <li key={m} className="flex justify-between"><span>{m}</span><span className="text-muted-foreground">{t}</span></li>
            ))}
          </ul>
        </Panel>
        <Panel title="Upcoming">
          <p className="text-sm font-semibold">Dr. Sarah Menon</p>
          <p className="text-xs text-muted-foreground">Nephrology · Video · Tomorrow 10:30 AM</p>
        </Panel>
        <Panel title="Family">
          <ul className="space-y-2 text-sm">
            {["Mummy — BP stable","Papa — refill due","Aarav — vaccine in 12 days"].map((f) => (
              <li key={f} className="text-muted-foreground">{f}</li>
            ))}
          </ul>
        </Panel>
      </div>
    );
  }

  if (kind === "pharmacy") {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        <StatTile icon={IndianRupee} k="₹42,180" v="Today's revenue" />
        <StatTile icon={Package} k="128" v="Orders today" />
        <StatTile icon={Users} k="+18%" v="New customers WoW" />
        <StatTile icon={TrendingUp} k="96%" v="Fulfillment rate" />
        <div className="md:col-span-2"><Panel title="Live orders">
          <ul className="space-y-2 text-sm">
            {[["#8421","Meera I.","₹680","Packing"],["#8422","Rohit K.","₹210","Out for delivery"],["#8423","Anita V.","₹95","New"]].map(([id,n,p,s]) => (
              <li key={id} className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2">
                <span className="font-mono text-xs">{id}</span><span>{n}</span><span className="font-semibold">{p}</span><span className="text-xs text-muted-foreground">{s}</span>
              </li>
            ))}
          </ul>
        </Panel></div>
        <div className="md:col-span-2"><Panel title="Low stock">
          <ul className="space-y-2 text-sm">
            {["Telmisartan 40mg — 4 left","Metformin 500mg — 12 left","ORS sachets — 6 left"].map(x => <li key={x}>{x}</li>)}
          </ul>
        </Panel></div>
      </div>
    );
  }

  if (kind === "doctor") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <StatTile icon={Users} k="14" v="Today's patients" />
        <StatTile icon={Clock} k="12 min" v="Avg. consult" />
        <StatTile icon={FileText} k="9" v="e-Prescriptions" />
        <div className="md:col-span-2"><Panel title="Today's schedule">
          <ul className="space-y-2 text-sm">
            {[["10:00","Meena Rao","Follow-up"],["10:30","Rahul Iyer","Fever"],["11:00","Aarav K.","Vaccination"],["11:30","Sita Devi","BP review"]].map(([t,n,r]) => (
              <li key={t+n} className="flex justify-between rounded-xl bg-secondary px-3 py-2">
                <span className="font-mono text-xs">{t}</span><span>{n}</span><span className="text-xs text-muted-foreground">{r}</span>
              </li>
            ))}
          </ul>
        </Panel></div>
        <Panel title="Patient card">
          <p className="text-sm font-semibold">Sita Devi, 62</p>
          <p className="mt-1 text-xs text-muted-foreground">HTN, T2DM · Last visit 22 days ago</p>
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            <li>BP: 138/86 (home avg)</li><li>HbA1c: 7.1</li><li>Meds: Amlodipine, Metformin</li>
          </ul>
        </Panel>
      </div>
    );
  }

  if (kind === "lab") {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        <StatTile icon={FlaskConical} k="42" v="Samples today" />
        <StatTile icon={Calendar} k="18" v="Home collections" />
        <StatTile icon={FileText} k="31" v="Reports uploaded" />
        <StatTile icon={TrendingUp} k="+22%" v="Growth WoW" />
        <div className="md:col-span-2"><Panel title="Collection route (Solapur East)">
          <ul className="space-y-2 text-sm">
            {[["9:30","Ashish Nagar","CBC + Lipid"],["10:15","Kranti Chowk","Vitamin D"],["11:00","Datta Nagar","Thyroid panel"]].map(([t,l,s]) => (
              <li key={t} className="flex justify-between rounded-xl bg-secondary px-3 py-2">
                <span className="font-mono text-xs">{t}</span><span>{l}</span><span className="text-xs text-muted-foreground">{s}</span>
              </li>
            ))}
          </ul>
        </Panel></div>
        <div className="md:col-span-2"><Panel title="Pending reports">
          <ul className="space-y-2 text-sm">
            {["Lipid — Meera I. (ready)","HbA1c — Sita D. (in review)","Thyroid — Rohan P. (uploading)"].map(x => <li key={x}>{x}</li>)}
          </ul>
        </Panel></div>
      </div>
    );
  }

  // admin
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatTile icon={Users} k="1.24M" v="Active families" />
      <StatTile icon={LayoutDashboard} k="9,412" v="Active partners" />
      <StatTile icon={IndianRupee} k="₹18.6 Cr" v="GMV this month" />
      <StatTile icon={ShieldCheck} k="99.98%" v="Uptime" />
      <div className="md:col-span-2"><Panel title="Top growing regions">
        <ul className="space-y-2 text-sm">
          {[["Maharashtra Tier-3","+34%"],["Rajasthan Tier-2","+29%"],["Odisha blocks","+41%"]].map(([r,g]) => (
            <li key={r} className="flex justify-between rounded-xl bg-secondary px-3 py-2"><span>{r}</span><span className="font-semibold gradient-brand-text">{g}</span></li>
          ))}
        </ul>
      </Panel></div>
      <div className="md:col-span-2"><Panel title="Live network">
        <ul className="space-y-2 text-sm">
          {["3,412 medicine orders in flight","217 doctor consults happening now","28 ambulances dispatched today","1.9M AI conversations this week"].map(x => <li key={x}>{x}</li>)}
        </ul>
      </Panel></div>
    </div>
  );
}

function _touch() { return [Stethoscope]; }
_touch;