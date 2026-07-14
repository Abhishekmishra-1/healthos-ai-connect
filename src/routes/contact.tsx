import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/simple-page";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MEDOOGLE AI" },
      { name: "description", content: "Talk to our team about partnerships, press, careers, or support." },
      { property: "og:title", content: "Contact MEDOOGLE AI" },
      { property: "og:description", content: "We usually reply within one business day." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SimplePage
      eyebrow="Get in touch"
      title={<>We usually reply <span className="gradient-brand-text">within a day.</span></>}
      description="Sales, partnerships, press, or just a hello — pick a channel below or send us a note."
    >
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          { icon: Mail, label: "Email us", value: "hello@healthos.ai" },
          { icon: Phone, label: "Call us", value: "+91 80 4718 2000" },
          { icon: MapPin, label: "Visit us", value: "Indiranagar, Bengaluru 560038" },
        ].map((c) => (
          <div key={c.label} className="rounded-3xl border border-border/60 bg-card p-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl gradient-brand text-white">
              <c.icon className="h-4 w-4" />
            </span>
            <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-base font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <form className="mt-10 rounded-3xl border border-border/60 bg-card p-8" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Name</span>
            <input className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" placeholder="Priya Sharma" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Email</span>
            <input type="email" className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" placeholder="you@example.com" />
          </label>
        </div>
        <label className="mt-4 block">
          <span className="text-xs font-medium text-muted-foreground">Message</span>
          <textarea rows={5} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" placeholder="Tell us how we can help…" />
        </label>
        <button className="mt-6 rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-glow">
          Send message
        </button>
      </form>
    </SimplePage>
  );
}