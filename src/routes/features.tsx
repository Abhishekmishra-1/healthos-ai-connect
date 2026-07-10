import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/simple-page";
import { Sparkles, Pill, Stethoscope, FlaskConical, FileHeart, Bell, Siren, Users, Building2, Ambulance, Syringe, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — HealthOS AI" },
      { name: "description", content: "Twelve services, one intelligent network. Explore every capability inside HealthOS AI." },
      { property: "og:title", content: "HealthOS AI Features" },
      { property: "og:description", content: "The complete healthcare toolbox for every Indian family." },
    ],
  }),
  component: Features,
});

const items = [
  { icon: Sparkles, t: "AI Health Assistant", d: "Ask any health question in Hindi or English. Understand prescriptions, symptoms and lab reports." },
  { icon: Pill, t: "Medicine Delivery", d: "Real-time inventory across 8,400+ verified partner pharmacies with prescription upload." },
  { icon: Stethoscope, t: "Doctor Consultations", d: "Video or in-clinic, filtered by language, distance and price." },
  { icon: FlaskConical, t: "Pathology & Labs", d: "Home sample collection with AI-explained reports and doctor recommendations." },
  { icon: FileHeart, t: "Digital Health Records", d: "ABDM-compliant timeline for the whole family with QR sharing." },
  { icon: Bell, t: "Medicine Reminders", d: "Voice reminders in Hindi, missed-dose alerts sent to family members." },
  { icon: Siren, t: "Emergency SOS", d: "One tap ambulance, live location share, nearest hospital display." },
  { icon: Users, t: "Family Health", d: "Up to 8 members, pregnancy tracker, child vaccination schedule, elderly monitoring." },
  { icon: Building2, t: "Hospital Network", d: "Cashless partner hospitals with real-time bed availability." },
  { icon: Ambulance, t: "Ambulance Dispatch", d: "3.8 min average dispatch across 240+ Indian towns." },
  { icon: Syringe, t: "Vaccinations", d: "Automatic child schedules and adult booster reminders." },
  { icon: HeartPulse, t: "Home Nursing & Physio", d: "Verified caregivers for post-op, elderly and recovery care." },
];

function Features() {
  return (
    <SimplePage
      eyebrow="Every capability"
      title={<>The full <span className="gradient-brand-text">healthcare toolbox.</span></>}
      description="One network, twelve services, zero context-switching."
    >
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {items.map((i) => (
          <div key={i.t} className="rounded-3xl border border-border/60 bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-glow">
            <span className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand text-white shadow-glow">
              <i.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">{i.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{i.d}</p>
          </div>
        ))}
      </div>
    </SimplePage>
  );
}