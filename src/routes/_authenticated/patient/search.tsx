import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { VoiceSearchInput } from "@/components/site/voice-search-input";

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
  const [q, setQ] = useState("");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Search</h1>
        <p className="mt-1 text-base text-muted-foreground">Type or speak. We'll find the right care.</p>
      </div>

      <VoiceSearchInput
        value={q}
        onChange={setQ}
        placeholder="e.g. fever medicine, heart doctor, blood test"
        ariaLabel="Search doctors, medicines, tests"
      />

      <div>
        <p className="mb-3 text-sm font-semibold text-muted-foreground">Quick access</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {QUICK.map((q) => (
            <Link key={q.label} to={q.to} className="flex min-h-14 items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary">
              <span className="text-2xl">{q.emoji}</span>
              <span className="text-base font-semibold">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
