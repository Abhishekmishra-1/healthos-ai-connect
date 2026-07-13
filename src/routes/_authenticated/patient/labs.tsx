import { createFileRoute, Link } from "@tanstack/react-router";
import { FlaskConical, Home, Truck, Download, Sparkles, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/labs")({
  head: () => ({ meta: [{ title: "Lab Tests — HealthOS AI" }] }),
  component: LabsPage,
});

const POPULAR = [
  { name: "Complete Blood Count (CBC)", code: "CBC", price: 299, tat: "6 hrs" },
  { name: "Lipid Profile", code: "LIPID", price: 549, tat: "8 hrs" },
  { name: "HbA1c (Diabetes)", code: "HBA1C", price: 449, tat: "10 hrs" },
  { name: "Thyroid Profile (T3, T4, TSH)", code: "THYROID", price: 599, tat: "12 hrs" },
  { name: "Liver Function Test", code: "LFT", price: 649, tat: "10 hrs" },
  { name: "Kidney Function Test", code: "KFT", price: 649, tat: "10 hrs" },
  { name: "Vitamin D (25-OH)", code: "VITD", price: 899, tat: "24 hrs" },
  { name: "Vitamin B12", code: "VITB12", price: 799, tat: "24 hrs" },
];

const PACKAGES = [
  { name: "Full Body Basic", tests: 42, price: 999, mrp: 2400 },
  { name: "Diabetes Care", tests: 24, price: 799, mrp: 1800 },
  { name: "Heart Health", tests: 30, price: 1299, mrp: 2900 },
  { name: "Women's Wellness", tests: 48, price: 1499, mrp: 3400 },
];

export function LabsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Lab Tests</h1>
        <p className="mt-2 text-sm text-muted-foreground">Home sample collection · Certified labs · AI explanation of results.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <FeatureChip icon={Home} title="Home collection" desc="Free pickup from your doorstep" />
        <FeatureChip icon={Truck} title="Track sample" desc="Live status till report is ready" />
        <FeatureChip icon={Sparkles} title="AI explanation" desc="Plain-English report summary" />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Popular tests</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {POPULAR.map((t) => (
            <div key={t.code} className="flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-4 transition hover:shadow-glow">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/10 text-fuchsia-500">
                <FlaskConical className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">Report in {t.tat}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">₹{t.price}</p>
                <button className="mt-1 rounded-full gradient-brand px-3 py-1 text-xs font-semibold text-white shadow-glow">Book</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Health check packages</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((p) => (
            <div key={p.name} className="flex flex-col rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 to-transparent p-5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl gradient-brand text-white shadow-glow"><HeartPulse className="h-4 w-4" /></span>
              <p className="mt-3 text-sm font-semibold">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.tests} tests included</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-lg font-semibold">₹{p.price}</p>
                  <p className="text-xs text-muted-foreground line-through">₹{p.mrp}</p>
                </div>
                <button className="rounded-full gradient-brand px-3 py-1.5 text-xs font-semibold text-white shadow-glow">Book</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between rounded-3xl border border-border/60 bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary"><Download className="h-4 w-4" /></span>
          <div>
            <p className="text-sm font-semibold">Your past reports</p>
            <p className="text-xs text-muted-foreground">Download PDF or ask AI to explain.</p>
          </div>
        </div>
        <Link to="/patient/records" className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold">View</Link>
      </div>
    </div>
  );
}

function FeatureChip({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-border/60 bg-card p-4">
      <span className="grid h-10 w-10 place-items-center rounded-2xl gradient-brand text-white shadow-glow"><Icon className="h-4 w-4" /></span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}