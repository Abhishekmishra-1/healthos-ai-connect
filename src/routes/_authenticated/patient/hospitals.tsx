import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Hospital, MapPin, Navigation, Phone, Search, Siren } from "lucide-react";
import { LocationBar } from "@/components/patient/location-bar";

export const Route = createFileRoute("/_authenticated/patient/hospitals")({
  head: () => ({ meta: [
    { title: "Find Hospitals — MEDOOGLE AI" },
    { name: "description", content: "Find hospitals and emergency care near your location." },
    { property: "og:title", content: "Find Hospitals — MEDOOGLE AI" },
    { property: "og:description", content: "Find hospitals and emergency care near your location." },
  ] }),
  component: HospitalsPage,
});

const CATEGORIES = [
  { label: "Emergency", icon: Siren },
  { label: "General Hospital", icon: Hospital },
  { label: "Eye Hospital", icon: Hospital },
  { label: "Child Hospital", icon: Hospital },
  { label: "Heart Hospital", icon: Hospital },
  { label: "Orthopedic", icon: Hospital },
  { label: "Nearby Hospital", icon: MapPin },
] as const;

const HOSPITALS = [
  { name: "CityCare Multispeciality Hospital", category: "General Hospital", area: "Kothrud", phone: "02041001000", emergency: true },
  { name: "Sahyadri Eye & Vision Centre", category: "Eye Hospital", area: "Aundh", phone: "02041002000", emergency: false },
  { name: "Balaji Children's Hospital", category: "Child Hospital", area: "Baner", phone: "02041003000", emergency: true },
  { name: "HeartFirst Cardiac Institute", category: "Heart Hospital", area: "Shivajinagar", phone: "02041004000", emergency: true },
  { name: "LifeLine Orthopaedic Centre", category: "Orthopedic", area: "Wakad", phone: "02041005000", emergency: false },
];

function HospitalsPage() {
  const [category, setCategory] = useState("Nearby Hospital");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => HOSPITALS.filter((hospital) => {
    const matchesCategory = category === "Nearby Hospital" || category === "Emergency" ? true : hospital.category === category;
    const matchesQuery = `${hospital.name} ${hospital.area}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [category, query]);

  function directions(hospital: (typeof HOSPITALS)[number]) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hospital.name}, ${hospital.area}`)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Find Hospital</h1>
        <p className="mt-1 text-muted-foreground">Pick a category to see hospitals near you.</p>
      </div>

      <LocationBar />

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search hospitals or areas" className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATEGORIES.map((c) => (
          <button key={c.label} type="button" onClick={() => setCategory(c.label)} className={`flex flex-col items-start gap-3 rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-glow ${category === c.label ? "border-primary bg-primary/5" : "border-border/60 bg-card"}`}>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-primary"><c.icon className="h-5 w-5" /></span>
            <span className="text-base font-semibold">{c.label}</span>
          </button>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">{category === "Nearby Hospital" ? "Hospitals near you" : category}</h2><span className="text-xs text-muted-foreground">{filtered.length} found</span></div>
        {filtered.length === 0 ? <div className="rounded-3xl border border-dashed p-8 text-center text-sm text-muted-foreground">No hospitals match this search.</div> : filtered.map((hospital) => (
          <div key={hospital.name} className="rounded-3xl border border-border/60 bg-card p-5">
            <div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Hospital className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="font-semibold">{hospital.name}</p><p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {hospital.area} · {hospital.category}</p></div>{hospital.emergency && <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold text-destructive">24×7 emergency</span>}</div>
            <div className="mt-4 flex flex-wrap gap-2"><a href={`tel:${hospital.phone}`} className="inline-flex items-center gap-2 rounded-full gradient-brand px-4 py-2 text-xs font-semibold text-white shadow-glow"><Phone className="h-3.5 w-3.5" /> Call hospital</a><button type="button" onClick={() => directions(hospital)} className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-semibold"><Navigation className="h-3.5 w-3.5" /> Directions</button></div>
          </div>
        ))}
      </section>

      <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-destructive text-destructive-foreground"><Hospital className="h-5 w-5" /></span>
          <div>
            <p className="text-base font-semibold text-destructive">Ambulance needed?</p>
            <p className="text-sm text-destructive/80">Call national helpline 108 — free of cost.</p>
          </div>
        </div>
        <a href="tel:108" className="mt-3 inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-3 text-base font-semibold text-destructive-foreground">
          <Phone className="h-5 w-5" /> Call 108
        </a>
      </div>
    </div>
  );
}
