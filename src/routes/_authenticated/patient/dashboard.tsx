import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stethoscope, Pill, FlaskConical, Hospital, FolderHeart, Bot, Phone, LifeBuoy } from "lucide-react";
import { LocationBar } from "@/components/patient/location-bar";

export const Route = createFileRoute("/_authenticated/patient/dashboard")({
  head: () => ({ meta: [{ title: "Home — MEDOOGLE AI" }] }),
  component: Dashboard,
});

const ACTIONS = [
  { to: "/patient/doctors", label: "Find Doctor", emoji: "🩺", icon: Stethoscope, tint: "from-sky-100 to-white", ring: "ring-sky-200", color: "text-sky-600" },
  { to: "/patient/medicine", label: "Buy Medicine", emoji: "💊", icon: Pill, tint: "from-emerald-100 to-white", ring: "ring-emerald-200", color: "text-emerald-600" },
  { to: "/patient/labs", label: "Book Lab Test", emoji: "🧪", icon: FlaskConical, tint: "from-fuchsia-100 to-white", ring: "ring-fuchsia-200", color: "text-fuchsia-600" },
  { to: "/patient/hospitals", label: "Find Hospital", emoji: "🏥", icon: Hospital, tint: "from-indigo-100 to-white", ring: "ring-indigo-200", color: "text-indigo-600" },
  { to: "/patient/records", label: "My Reports", emoji: "📄", icon: FolderHeart, tint: "from-amber-100 to-white", ring: "ring-amber-200", color: "text-amber-600" },
] as const;

function Dashboard() {
  const [name, setName] = useState("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const n = ((data.user?.user_metadata as any)?.full_name ?? data.user?.email?.split("@")[0] ?? "") as string;
      setName(n.split(" ")[0]);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="pt-2">
        <p className="text-2xl">Hello {name || "there"} 👋</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
          How can we help you today?
        </h1>
      </div>

      {/* Where are you? */}
      <LocationBar />

      {/* Five big buttons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ACTIONS.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className={`group flex items-center gap-5 rounded-3xl border border-border/60 bg-gradient-to-br ${a.tint} p-6 ring-1 ${a.ring} transition hover:-translate-y-0.5 hover:shadow-glow`}
          >
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-3xl shadow-sm">
              {a.emoji}
            </span>
            <div className="min-w-0">
              <p className={`text-xl font-semibold tracking-tight ${a.color}`}>{a.label}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">Tap to continue</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Emergency SOS */}
      <div className="rounded-3xl border border-red-200 bg-red-50 p-5">
        <p className="text-base font-semibold text-red-600">Emergency?</p>
        <p className="mt-1 text-sm text-red-700/80">One tap for ambulance and nearby hospital.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href="tel:108" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-base font-semibold text-white shadow-glow hover:bg-red-700">
            <Phone className="h-5 w-5" /> Call 108
          </a>
          <Link to="/patient/emergency" className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-white px-5 py-3 text-base font-semibold text-red-600 hover:bg-red-100">
            SOS
          </Link>
        </div>
      </div>

      {/* Help */}
      <Link
        to="/patient/support"
        className="flex items-center justify-between rounded-3xl border border-border/60 bg-card p-5 hover:bg-secondary"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-primary">
            <LifeBuoy className="h-5 w-5" />
          </span>
          <div>
            <p className="text-base font-semibold">☎ Need Help?</p>
            <p className="text-sm text-muted-foreground">Talk to our support team</p>
          </div>
        </div>
        <span className="text-primary">→</span>
      </Link>

      {/* Floating AI button */}
      <Link
        to="/patient/ai-assistant"
        aria-label="AI Assistant"
        className="fixed bottom-24 right-5 z-30 grid h-16 w-16 place-items-center rounded-full gradient-brand text-white shadow-glow md:bottom-8"
      >
        <Bot className="h-7 w-7" />
      </Link>
    </div>
  );
}
