import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon, Mic, Stethoscope, Pill, FlaskConical, Hospital, FolderHeart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/search")({
  head: () => ({ meta: [{ title: "Search — MEDOOGLE AI" }] }),
  component: SearchPage,
});

const QUICK = [
  { to: "/patient/doctors", label: "Doctors", emoji: "🩺" },
  { to: "/patient/medicine", label: "Medicines", emoji: "💊" },
  { to: "/patient/labs", label: "Lab tests", emoji: "🧪" },
  { to: "/patient/hospitals", label: "Hospitals", emoji: "🏥" },
  { to: "/patient/records", label: "Reports", emoji: "📄" },
] as const;

function SearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
        <p className="mt-1 text-muted-foreground">Type or speak. We'll find the right care.</p>
      </div>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="e.g. fever medicine, heart doctor, blood test"
          className="w-full rounded-full border border-border bg-card py-4 pl-14 pr-16 text-base outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          aria-label="Speak"
          className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full gradient-brand text-white shadow-glow"
        >
          <Mic className="h-5 w-5" />
        </button>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-muted-foreground">Quick access</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {QUICK.map((q) => (
            <Link key={q.label} to={q.to} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 hover:bg-secondary">
              <span className="text-2xl">{q.emoji}</span>
              <span className="text-base font-semibold">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
