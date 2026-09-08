import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, FlaskConical, Home, MapPin, Truck, Download, Sparkles, HeartPulse, Loader2 } from "lucide-react";
import { LocationBar } from "@/components/patient/location-bar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

type Lab = { id: string; name: string; city: string | null; address: string | null; phone: string | null };
type Slot = { id: string; lab_id: string; slot_date: string; slot_time: string; available: boolean };

export function LabsPage() {
  const [selected, setSelected] = useState<{ name: string; code?: string; price: number } | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [labId, setLabId] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingLabs, setLoadingLabs] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("08:00 AM - 09:00 AM");
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    async function loadLabs() {
      const { data, error } = await supabase.from("catalog_labs").select("id, name, city, address, phone").eq("active", true).order("name");
      if (error) toast.error("Could not load diagnostic labs.");
      const next = (data as Lab[] | null) ?? [];
      setLabs(next);
      setLabId(next[0]?.id ?? "");
      setLoadingLabs(false);
    }
    loadLabs();
  }, []);

  useEffect(() => {
    if (!labId || !date) return;
    async function loadSlots() {
      setLoadingSlots(true);
      const { data, error } = await supabase.from("lab_booking_slots").select("id, lab_id, slot_date, slot_time, available").eq("lab_id", labId).eq("slot_date", date).eq("available", true).order("slot_time");
      if (error) toast.error("Could not load collection slots.");
      setSlots((data as Slot[] | null) ?? []);
      setLoadingSlots(false);
    }
    loadSlots();
  }, [date, labId]);

  function selectTest(test: { name: string; price: number }) {
    setSelected(test);
    setConfirmed(false);
    setDate(new Date().toISOString().slice(0, 10));
    setTime("");
  }

  async function confirmBooking() {
    if (!selected || !date || !time || !address.trim() || !labId) return;
    const lab = labs.find((item) => item.id === labId);
    if (!lab) return;
    setSaving(true);
    const { error } = await supabase.rpc("book_lab_test", {
      p_lab_id: lab.id,
      p_lab_name: lab.name,
      p_test_name: selected.name,
      p_test_code: selected.code ?? "",
      p_price: selected.price,
      p_slot_date: date,
      p_slot_time: time,
      p_collection_address: address.trim(),
    });
    setSaving(false);
    if (error) { toast.error(error.message.includes("no longer") ? error.message : "Could not confirm this booking."); return; }
    setConfirmed(true);
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
              <p className="mt-1 text-sm text-muted-foreground">{selected.name} · {labs.find((lab) => lab.id === labId)?.name} · {date} · {time}</p>
              <p className="mt-1 text-xs text-muted-foreground">A collection partner will call before visiting your address.</p>
              <div className="mt-4 flex justify-center gap-2"><Link to="/patient/orders" className="rounded-full gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow">View orders</Link><button type="button" onClick={() => setSelected(null)} className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold">Book another</button></div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">Book your test</p><h2 className="mt-1 text-xl font-semibold">{selected.name}</h2><p className="mt-1 text-sm text-muted-foreground">₹{selected.price} · Home sample collection</p></div><button type="button" onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground">Close</button></div>
               <div className="mt-5 grid gap-3 md:grid-cols-2"><label className="text-sm font-medium">Diagnostic lab<select value={labId} onChange={(e) => { setLabId(e.target.value); setTime(""); }} disabled={loadingLabs} className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40">{labs.map((lab) => <option key={lab.id} value={lab.id}>{lab.name} · {lab.city}</option>)}</select></label><label className="text-sm font-medium">Date<input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => { setDate(e.target.value); setTime(""); }} className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" /></label><label className="text-sm font-medium">Collection time<select value={time} onChange={(e) => setTime(e.target.value)} disabled={loadingSlots || slots.length === 0} className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"><option value="">{loadingSlots ? "Loading slots…" : slots.length ? "Choose a time" : "No slots available"}</option>{slots.map((slot) => <option key={slot.id} value={slot.slot_time}>{slot.slot_time}</option>)}</select></label><label className="text-sm font-medium">Collection address<input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, street, PIN code" className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" /></label></div>
               <button type="button" onClick={confirmBooking} disabled={!date || !time || !address.trim() || !labId || saving} className="mt-4 inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />} Confirm booking · ₹{selected.price}</button>
               {(!date || !time || !address.trim()) && <p className="mt-2 text-xs text-muted-foreground">Choose a lab, date, available time and collection address to continue.</p>}
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