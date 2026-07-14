import { createFileRoute, Link } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/simple-page";
import { Store, Stethoscope, FlaskConical, Building2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — MEDOOGLE AI" },
      { name: "description", content: "Join 8,400+ pharmacies, 12,000+ doctors, and 900+ labs already growing on the MEDOOGLE network." },
      { property: "og:title", content: "Partner with MEDOOGLE AI" },
      { property: "og:description", content: "Run your pharmacy, clinic, or lab on the intelligent healthcare network." },
    ],
  }),
  component: Partners,
});

const partners = [
  { icon: Store, t: "Pharmacies", d: "Digital billing, inventory, and instant access to millions of patients in your area." },
  { icon: Stethoscope, t: "Doctors & Clinics", d: "Appointments, digital prescriptions, video consultations, and patient history — free to start." },
  { icon: FlaskConical, t: "Pathology Labs", d: "Sample collection scheduling, report upload, and AI-powered patient summaries." },
  { icon: Building2, t: "Hospitals", d: "Bed availability, referrals, and cashless partnerships with 1.2M+ member families." },
];

function Partners() {
  return (
    <SimplePage
      eyebrow="Grow on MEDOOGLE"
      title={<>Run your practice on the <span className="gradient-brand-text">intelligent network.</span></>}
      description="Free to start. 15-minute onboarding. Real patients from day one."
    >
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {partners.map((p) => (
          <div key={p.t} className="group rounded-3xl border border-border/60 bg-card p-8 transition hover:-translate-y-0.5 hover:shadow-glow">
            <span className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white shadow-glow">
              <p.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{p.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            <Link to="/contact" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold gradient-brand-text">
              Become a partner <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </SimplePage>
  );
}