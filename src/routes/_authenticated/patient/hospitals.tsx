import { createFileRoute } from "@tanstack/react-router";
import { Hospital, Phone } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/hospitals")({
  head: () => ({ meta: [{ title: "Hospitals — MEDOOGLE AI" }] }),
  component: HospitalsPage,
});

const CATEGORIES = [
  { label: "Emergency", emoji: "🚑" },
  { label: "General Hospital", emoji: "🏥" },
  { label: "Eye Hospital", emoji: "👁" },
  { label: "Child Hospital", emoji: "👶" },
  { label: "Heart Hospital", emoji: "❤️" },
  { label: "Orthopedic", emoji: "🦴" },
  { label: "Nearby Hospital", emoji: "📍" },
] as const;

function HospitalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Find Hospital</h1>
        <p className="mt-1 text-muted-foreground">Pick a category to see hospitals near you.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.label}
            className="flex flex-col items-start gap-3 rounded-3xl border border-border/60 bg-card p-5 text-left transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            <span className="text-3xl">{c.emoji}</span>
            <span className="text-base font-semibold">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-600 text-white"><Hospital className="h-5 w-5" /></span>
          <div>
            <p className="text-base font-semibold text-red-700">Ambulance needed?</p>
            <p className="text-sm text-red-700/80">Call national helpline 108 — free of cost.</p>
          </div>
        </div>
        <a href="tel:108" className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-base font-semibold text-white">
          <Phone className="h-5 w-5" /> Call 108
        </a>
      </div>
    </div>
  );
}
