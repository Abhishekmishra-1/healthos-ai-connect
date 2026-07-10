import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/simple-page";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — HealthOS AI" },
      { name: "description", content: "Notes on building healthcare infrastructure for Bharat — product, research, and field stories." },
      { property: "og:title", content: "HealthOS AI Blog" },
      { property: "og:description", content: "Product, research, and field notes from the intelligent healthcare network." },
    ],
  }),
  component: Blog,
});

const posts = [
  { t: "How we route ambulances in villages with unreliable GPS", d: "Field notes from 40+ blocks in Bihar and Odisha.", tag: "Engineering", read: "8 min" },
  { t: "Aarogya, our multilingual clinical LLM", d: "Why we built our own model and how we keep it safe.", tag: "AI Research", read: "12 min" },
  { t: "The local chemist is the future of Indian healthcare", d: "A love letter to 8 million small pharmacies.", tag: "Essays", read: "6 min" },
  { t: "Designing for grandmothers, not gadgets", d: "Lessons from 90 usability sessions in rural India.", tag: "Design", read: "9 min" },
];

function Blog() {
  return (
    <SimplePage
      eyebrow="Field notes"
      title={<>Building healthcare, <span className="gradient-brand-text">in the open.</span></>}
      description="Product, research, and field stories from across the HealthOS network."
    >
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <article key={p.t} className="group rounded-3xl border border-border/60 bg-card p-8 transition hover:-translate-y-0.5 hover:shadow-glow">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-foreground">{p.tag}</span>
              <span>{p.read} read</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight group-hover:gradient-brand-text">{p.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
          </article>
        ))}
      </div>
    </SimplePage>
  );
}