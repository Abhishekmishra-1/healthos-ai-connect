import { createFileRoute, Link } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/simple-page";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — MEDOOGLE AI" },
      { name: "description", content: "Fair, transparent pricing built for Bharat. Free forever plan, Care membership at ₹99/month, and custom partner plans." },
      { property: "og:title", content: "MEDOOGLE AI Pricing" },
      { property: "og:description", content: "Free forever. Care at ₹99/month. Custom for partners." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Free",
    price: "₹0",
    note: "forever",
    desc: "The essentials, for every family.",
    features: ["AI Health Assistant (30/mo)", "Medicine search & delivery", "Digital records", "Emergency SOS", "1 family member"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Care",
    price: "₹99",
    note: "per month",
    desc: "For the whole household.",
    features: ["Unlimited AI assistant", "Free doctor follow-ups", "12% off medicines", "Priority ambulance", "Up to 8 family members", "Annual health check"],
    cta: "Get Care",
    highlighted: true,
  },
  {
    name: "Partner",
    price: "Custom",
    note: "for clinics & pharmacies",
    desc: "Run your practice on MEDOOGLE.",
    features: ["Full pharmacy / clinic / lab dashboard", "Digital billing & inventory", "Patient network access", "Analytics & insights", "Dedicated onboarding"],
    cta: "Talk to sales",
    highlighted: false,
  },
];

function PricingPage() {
  return (
    <SimplePage
      eyebrow="Pricing"
      title={<>Fair, transparent, <span className="gradient-brand-text">built for Bharat.</span></>}
      description="No hidden fees. Cancel anytime. GST included."
    >
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative flex flex-col rounded-3xl border p-8 ${
              p.highlighted ? "border-transparent gradient-brand text-white shadow-glow" : "border-border/60 bg-card"
            }`}
          >
            <h3 className={`text-sm font-semibold uppercase tracking-widest ${p.highlighted ? "text-white/80" : "text-muted-foreground"}`}>
              {p.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight">{p.price}</span>
              <span className={p.highlighted ? "text-sm text-white/70" : "text-sm text-muted-foreground"}>/{p.note}</span>
            </p>
            <p className={`mt-2 text-sm ${p.highlighted ? "text-white/85" : "text-muted-foreground"}`}>{p.desc}</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.highlighted ? "text-white" : "text-primary"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                p.highlighted ? "bg-white text-primary hover:bg-white/90" : "border border-border bg-background hover:bg-secondary"
              }`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </SimplePage>
  );
}