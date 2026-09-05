import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, CheckCircle2, Clock, FlaskConical, Home, MapPin, Truck, Download, Sparkles, HeartPulse } from "lucide-react";
import { LocationBar } from "@/components/patient/location-bar";

export const Route = createFileRoute("/_authenticated/patient/labs")({
  head: () => ({ meta: [
    { title: "Book Lab Tests — MEDOOGLE AI" },
    { name: "description", content: "Book certified lab tests with convenient home sample collection." },
    { property: "og:title", content: "Book Lab Tests — MEDOOGLE AI" },
    { property: "og:description", content: "Book certified lab tests with convenient home sample collection." },
  ] }),
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
  const [selected, setSelected] = useState<{ name: string; price: number } | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("08:00 AM - 09:00 AM");
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  function selectTest(test: { name: string; price: number }) {
    setSelected(test);
    setConfirmed(false);
    setDate(new Date().toISOString().slice(0, 10));
  }

  function confirmBooking() {
    if (selected && date && address.trim()) setConfirmed(true);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Lab Tests</h1>
        <p className="mt-2 text-sm text-muted-foreground">Home sample collection · Certified labs · AI explanation of results.</p>
      </div>

      <LocationBar />

      {selected && (
        <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-glow">
          {confirmed ? (
            <div className="text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="h-7 w-7" /></span>
              <h2 className="mt-4 text-xl font-semibold">Lab test booked</h2>
              <p className="mt-1 text-sm text-muted-foreground">{selected.name} · {date} · {time}</p>
              <p className="mt-1 text-xs text-muted-foreground">A collection partner will call before visiting your address.</p>
              <div className="mt-4 flex justify-center gap-2"><Link to="/patient/orders" className="rounded-full gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow">View orders</Link><button type="button" onClick={() => setSelected(null)} className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold">Book another</button></div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">Book your test</p><h2 className="mt-1 text-xl font-semibold">{selected.name}</h2><p className="mt-1 text-sm text-muted-foreground">₹{selected.price} · Home sample collection</p></div><button type="button" onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground">Close</button></div>
              <div className="mt-5 grid gap-3 md:grid-cols-3"><label className="text-sm font-medium">Date<input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" /></label><label className="text-sm font-medium">Collection time<select value={time} onChange={(e) => setTime(e.target.value)} className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"><option>08:00 AM - 09:00 AM</option><option>10:00 AM - 11:00 AM</option><option>12:00 PM - 01:00 PM</option><option>04:00 PM - 05:00 PM</option></select></label><label className="text-sm font-medium">Collection address<input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, street, PIN code" className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" /></label></div>
              <button type="button" onClick={confirmBooking} disabled={!date || !address.trim()} className="mt-4 inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50"><CalendarDays className="h-4 w-4" /> Confirm booking · ₹{selected.price}</button>
              {(!date || !address.trim()) && <p className="mt-2 text-xs text-muted-foreground">Choose a date and enter your collection address to continue.</p>}
            </>
          )}
        </section>
      )}

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
                <button type="button" onClick={() => selectTest(t)} className="mt-1 rounded-full gradient-brand px-3 py-1 text-xs font-semibold text-white shadow-glow">Book</button>
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
                <button type="button" onClick={() => selectTest(p)} className="rounded-full gradient-brand px-3 py-1.5 text-xs font-semibold text-white shadow-glow">Book</button>
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