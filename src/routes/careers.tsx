import { createFileRoute, Link } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/simple-page";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — HealthOS AI" },
      { name: "description", content: "Help us build the operating system for Indian healthcare. Open roles in engineering, design, and operations." },
      { property: "og:title", content: "Careers at HealthOS AI" },
      { property: "og:description", content: "Do the best work of your life on a problem that matters." },
    ],
  }),
  component: Careers,
});

const roles = [
  { t: "Senior Product Engineer (React Native)", loc: "Bengaluru / Remote India", team: "Product" },
  { t: "Staff ML Engineer — Clinical NLP", loc: "Bengaluru", team: "AI" },
  { t: "Design Lead — Consumer", loc: "Bengaluru", team: "Design" },
  { t: "Regional Head, Maharashtra", loc: "Pune", team: "Operations" },
  { t: "Clinical Content Editor (Hindi)", loc: "Remote India", team: "Content" },
  { t: "Data Scientist — Pharmacy", loc: "Bengaluru", team: "Data" },
];

function Careers() {
  return (
    <SimplePage
      eyebrow="Careers"
      title={<>Do the best work of your life on a <span className="gradient-brand-text">problem that matters.</span></>}
      description="We're a small, senior team building for the next 500 million Indians. Come build with us."
    >
      <div className="mt-12 divide-y divide-border rounded-3xl border border-border/60 bg-card">
        {roles.map((r) => (
          <div key={r.t} className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-base font-semibold">{r.t}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {r.team}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {r.loc}</span>
              </div>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-1 self-start rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold transition hover:bg-secondary md:self-auto">
              Apply <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </SimplePage>
  );
}