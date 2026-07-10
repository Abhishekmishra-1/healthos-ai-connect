import { Link } from "@tanstack/react-router";
import { Sparkles, Github, Twitter, Linkedin, Instagram } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { to: "/features", label: "Features" },
      { to: "/pricing", label: "Pricing" },
      { to: "/demo/ai-assistant", label: "AI Assistant" },
      { to: "/demo/patient", label: "Patient App" },
      { to: "/demo/pharmacy", label: "Pharmacy Dashboard" },
      { to: "/demo/doctor", label: "Doctor Dashboard" },
      { to: "/demo/lab", label: "Lab Dashboard" },
      { to: "/demo/admin", label: "Admin Dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/careers", label: "Careers" },
      { to: "/partners", label: "Partners" },
      { to: "/blog", label: "Blog" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-border/60 bg-gradient-to-b from-transparent to-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-white shadow-glow">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-base font-semibold tracking-tight">
                HealthOS <span className="gradient-brand-text">AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The intelligent healthcare network. Built in India, for every Indian family.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background/60 text-muted-foreground transition hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-foreground">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-muted-foreground transition hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} HealthOS AI. Made with care in Bengaluru.</p>
          <p className="text-xs text-muted-foreground">Not a substitute for professional medical advice.</p>
        </div>
      </div>
    </footer>
  );
}