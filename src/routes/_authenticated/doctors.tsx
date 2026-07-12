import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star, Video, MessageCircle, CalendarCheck, MapPin, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/_authenticated/doctors")({
  head: () => ({ meta: [{ title: "Doctors — HealthOS AI" }] }),
  component: DoctorsPage,
});

const SPECS = ["All", "General Physician", "Dermatology", "Pediatrics", "Cardiology", "Gynecology", "Orthopedics", "ENT", "Psychiatry"];

const DOCTORS = [
  { id: 1, name: "Dr. Priya Sharma", spec: "General Physician", exp: 12, lang: "English, Hindi, Marathi", rating: 4.9, reviews: 1204, fee: 399, clinic: "Sunrise Clinic, Pune", online: true, gender: "F" },
  { id: 2, name: "Dr. Rahul Verma", spec: "Cardiology", exp: 18, lang: "English, Hindi", rating: 4.8, reviews: 986, fee: 799, clinic: "Ruby Hall, Pune", online: true, gender: "M" },
  { id: 3, name: "Dr. Ananya Iyer", spec: "Pediatrics", exp: 9, lang: "English, Tamil, Hindi", rating: 4.9, reviews: 612, fee: 499, clinic: "Little Steps, Aundh", online: true, gender: "F" },
  { id: 4, name: "Dr. Karan Mehta", spec: "Dermatology", exp: 7, lang: "English, Gujarati, Hindi", rating: 4.7, reviews: 421, fee: 599, clinic: "Skinovation, Baner", online: false, gender: "M" },
  { id: 5, name: "Dr. Meera Nair", spec: "Gynecology", exp: 14, lang: "English, Malayalam, Hindi", rating: 4.9, reviews: 892, fee: 699, clinic: "Motherhood, Kothrud", online: true, gender: "F" },
  { id: 6, name: "Dr. Vikram Singh", spec: "Orthopedics", exp: 20, lang: "English, Punjabi, Hindi", rating: 4.8, reviews: 1103, fee: 899, clinic: "Joint Care, Hinjewadi", online: false, gender: "M" },
];

export function DoctorsPage() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("All");

  const list = useMemo(() => DOCTORS.filter((d) =>
    (spec === "All" || d.spec === spec) &&
    (q === "" || (d.name + d.spec + d.clinic).toLowerCase().includes(q.toLowerCase())),
  ), [q, spec]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Doctor Consultation</h1>
        <p className="mt-2 text-sm text-muted-foreground">Book video, chat or in-clinic visits with verified specialists.</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, specialty or clinic"
          className="w-full rounded-2xl border border-border/60 bg-card py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {SPECS.map((s) => (
          <button key={s} onClick={() => setSpec(s)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${spec === s ? "gradient-brand text-white shadow-glow" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {list.map((d) => (
          <div key={d.id} className="rounded-3xl border border-border/60 bg-card p-5 transition hover:shadow-glow">
            <div className="flex gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl gradient-brand text-lg font-semibold text-white shadow-glow">
                {d.name.split(" ")[1]?.[0]}{d.name.split(" ")[2]?.[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.spec} · {d.exp} yrs exp.</p>
                  </div>
                  {d.online && <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">Online now</span>}
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {d.rating} ({d.reviews})</span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" /> {d.clinic}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Speaks {d.lang}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="text-sm"><span className="text-muted-foreground">Consultation</span> <span className="font-semibold">₹{d.fee}</span></div>
              <div className="flex gap-1.5">
                <button className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-secondary/70"><MessageCircle className="h-3.5 w-3.5" /> Chat</button>
                <button className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-secondary/70"><Video className="h-3.5 w-3.5" /> Video</button>
                <button className="inline-flex items-center gap-1 rounded-full gradient-brand px-3 py-1.5 text-xs font-semibold text-white shadow-glow"><CalendarCheck className="h-3.5 w-3.5" /> Book</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="rounded-3xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          <Stethoscope className="mx-auto mb-2 h-6 w-6" />
          No doctors match your search.
        </div>
      )}
    </div>
  );
}