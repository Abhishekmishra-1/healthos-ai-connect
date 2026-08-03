import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  FileHeart,
  FlaskConical,
  Hospital,
  Languages,
  Phone,
  Pill,
  ShieldCheck,
  Siren,
  Stethoscope,
} from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import heroOrb from "@/assets/hero-orb.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MEDOOGLE AI — Healthcare Made Simple" },
      {
        name: "description",
        content:
          "Doctors, medicines, lab tests, hospitals and health records in one simple app — built for Tier 2, Tier 3 India, in Hindi and English.",
      },
      { property: "og:title", content: "MEDOOGLE AI — Healthcare Made Simple" },
      {
        property: "og:description",
        content: "Find a doctor, buy medicine, book a lab test and keep your reports — all in one simple app.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const ACTIONS = [
  { to: "/patient/doctors", label: "Find Doctor", emoji: "🩺", icon: Stethoscope, tint: "from-sky-100 to-white", color: "text-sky-700" },
  { to: "/patient/medicine", label: "Buy Medicine", emoji: "💊", icon: Pill, tint: "from-emerald-100 to-white", color: "text-emerald-700" },
  { to: "/patient/labs", label: "Book Lab Test", emoji: "🧪", icon: FlaskConical, tint: "from-fuchsia-100 to-white", color: "text-fuchsia-700" },
  { to: "/patient/hospitals", label: "Find Hospital", emoji: "🏥", icon: Hospital, tint: "from-indigo-100 to-white", color: "text-indigo-700" },
  { to: "/patient/records", label: "My Reports", emoji: "📄", icon: FileHeart, tint: "from-amber-100 to-white", color: "text-amber-700" },
] as const;

const STEPS = [
  { n: "1", t: "Tell us what you need", d: "Tap a big button or just speak — in Hindi or English." },
  { n: "2", t: "We find the nearest help", d: "Doctors, chemists and labs around your PIN code." },
  { n: "3", t: "Everything stays saved", d: "Prescriptions, reports and reminders in one place." },
];

function LandingPage() {
  return (
    <PageShell>
      <Hero />
      <BigButtons />
      <Emergency />
      <Steps />
      <Trust />
      <CTA />
    </PageShell>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-10 pt-32 text-center md:pt-40">
      <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground">
        <Languages className="h-3.5 w-3.5" /> हिंदी और English · 240+ towns
      </span>
      <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
        Healthcare Made <span className="gradient-brand-text">Simple</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
        Doctors, medicines, lab tests and your reports — one easy app for the whole family.
      </p>
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/auth"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full gradient-brand px-6 py-4 text-base font-semibold text-white shadow-glow sm:w-auto"
        >
          Open the app <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          to="/patient/ai-assistant"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full glass px-6 py-4 text-base font-semibold sm:w-auto"
        >
          <Bot className="h-4 w-4" /> Ask AI
        </Link>
      </div>
      <img
        src={heroOrb}
        alt="MEDOOGLE AI healthcare network"
        width={1600}
        height={1200}
        className="animate-float mx-auto mt-10 w-full max-w-[340px]"
      />
    </section>
  );
}

function BigButtons() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-4" id="features">
      <h2 className="sr-only">What do you need?</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ACTIONS.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className={`flex items-center gap-4 rounded-3xl border border-border/60 bg-gradient-to-br ${a.tint} p-5 transition hover:-translate-y-0.5 hover:shadow-glow`}
          >
            <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-sm">
              {a.emoji}
            </span>
            <span className={`text-lg font-semibold tracking-tight ${a.color}`}>{a.label}</span>
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function Emergency() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-red-600">
            <Siren className="h-5 w-5" />
          </span>
          <div>
            <p className="text-base font-semibold text-red-600">Emergency?</p>
            <p className="text-sm text-red-700/80">Ambulance and nearest hospital in one tap.</p>
          </div>
        </div>
        <a
          href="tel:108"
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-base font-semibold text-white shadow-glow hover:bg-red-700"
        >
          <Phone className="h-4 w-4" /> Call 108
        </a>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">How it works</h2>
      <div className="mt-6 space-y-3">
        {STEPS.map((s) => (
          <div key={s.n} className="flex items-start gap-4 rounded-3xl border border-border/60 bg-card p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full gradient-brand text-sm font-bold text-white">
              {s.n}
            </span>
            <div>
              <p className="text-base font-semibold">{s.t}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-6">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-3xl border border-border/60 bg-card p-5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Reports stay private</span>
        <span className="inline-flex items-center gap-2"><Languages className="h-4 w-4 text-primary" /> Hindi &amp; English</span>
        <span className="inline-flex items-center gap-2"><Stethoscope className="h-4 w-4 text-primary" /> Verified doctors</span>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-24 pt-6 text-center">
      <div className="rounded-3xl gradient-brand p-8 text-white shadow-glow">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Start with MEDOOGLE AI today</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
          Free to use. Sign in with your mobile number and get help in minutes.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/auth" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-semibold text-primary sm:w-auto">
            Open the app <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contact" className="inline-flex w-full items-center justify-center rounded-full border border-white/40 px-6 py-3.5 text-base font-semibold text-white sm:w-auto">
            Contact sales
          </Link>
        </div>
      </div>
    </section>
  );
}
