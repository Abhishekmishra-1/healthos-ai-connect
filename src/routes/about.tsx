import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/simple-page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MEDOOGLE AI" },
      { name: "description", content: "We're building the operating system for Indian healthcare — starting from Tier 2 and Tier 3 towns." },
      { property: "og:title", content: "About MEDOOGLE AI" },
      { property: "og:description", content: "The story behind the intelligent healthcare network for Bharat." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SimplePage
      eyebrow="Our story"
      title={<>Healthcare for the <span className="gradient-brand-text">next 500 million</span> Indians.</>}
      description="We grew up watching our grandparents travel three hours to see a doctor, only to lose their prescriptions on the way back. MEDOOGLE AI is our answer."
    >
      <div className="prose prose-neutral mx-auto mt-12 max-w-none text-lg leading-relaxed text-foreground/85">
        <p>
          Modern healthcare in India has been built for the metros. Everyone else — the 900 million
          Indians in small towns and villages — makes do with a fragmented mess of chemists,
          clipboards, and long journeys to district hospitals. It shouldn't be this way.
        </p>
        <p>
          MEDOOGLE AI is one intelligent network that quietly connects your local pharmacy, your
          family doctor, the nearest lab, the closest ambulance, and your home caregivers. We speak
          your language. We understand your family. We remember every prescription so you don't have to.
        </p>
        <p>
          We're not another online pharmacy. We're building the operating system for healthcare —
          the calm, connected layer that finally makes healthcare feel human.
        </p>
      </div>
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          { k: "2023", v: "Founded in Bengaluru" },
          { k: "1.2M+", v: "Families on the network" },
          { k: "240+", v: "Cities & towns live" },
        ].map((s) => (
          <div key={s.k} className="rounded-3xl border border-border/60 bg-card p-8 text-center">
            <p className="text-4xl font-semibold tracking-tight gradient-brand-text">{s.k}</p>
            <p className="mt-2 text-sm text-muted-foreground">{s.v}</p>
          </div>
        ))}
      </div>
    </SimplePage>
  );
}