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
  MapPin,
  Sparkles,
  Star,
  Clock,
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
  {
    to: "/patient/doctors",
    label: "Find Doctor",
    hint: "Video or clinic visit",
    icon: Stethoscope,
    tint: "from-sky-100 via-sky-50 to-card",
    color: "text-sky-700",
    big: true,
  },
  { to: "/patient/medicine", label: "Buy Medicine", hint: "Home delivery", icon: Pill, tint: "from-emerald-100 via-emerald-50 to-card", color: "text-emerald-700" },
  { to: "/patient/labs", label: "Book Lab Test", hint: "Sample from home", icon: FlaskConical, tint: "from-fuchsia-100 via-fuchsia-50 to-card", color: "text-fuchsia-700" },
  { to: "/patient/hospitals", label: "Find Hospital", hint: "Beds & emergency", icon: Hospital, tint: "from-indigo-100 via-indigo-50 to-card", color: "text-indigo-700" },
  { to: "/patient/records", label: "My Reports", hint: "Safe forever", icon: FileHeart, tint: "from-amber-100 via-amber-50 to-card", color: "text-amber-700" },
] as const;

const STATS = [
  { v: "240+", l: "towns covered" },
  { v: "2 min", l: "to book a doctor" },
  { v: "12k+", l: "families helped" },
  { v: "24×7", l: "AI health help" },
];

const VOICES = [
  { q: "Papa ki report samajh nahi aati thi. Yahan AI ne Hindi mein samjha diya.", n: "Rekha S.", c: "Sagar, MP" },
  { q: "Village mein doctor nahi tha. Video call se 10 minute mein baat ho gayi.", n: "Imran K.", c: "Purnia, Bihar" },
  { q: "Medicine ghar tak aa gayi aur reminder bhi lagta hai. Bahut aasaan hai.", n: "Suresh P.", c: "Nashik, MH" },
];

const STEPS = [
  { n: "1", t: "Tell us what you need", d: "Tap a big button or just speak — in Hindi or English." },
  { n: "2", t: "We find the nearest help", d: "Doctors, chemists and labs around your PIN code." },
  { n: "3", t: "Everything stays saved", d: "Prescriptions, reports and reminders in one place." },
];

function LandingPage() {
  return (
    <PageShell>
      <Hero />
      <Stats />
      <BigButtons />
      <Emergency />
      <Steps />
      <Voices />
      <Trust />
      <CTA />
    </PageShell>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-12 pt-28 md:pt-36">
      {/* soft brand aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--brand-soft), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-[-10%] h-[380px] w-[380px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--accent-purple), transparent)" }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <Languages className="h-3.5 w-3.5 text-primary" /> हिंदी और English · 240+ towns
          </span>
          <h1 className="mt-5 text-balance text-[2.6rem] font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Healthcare Made <span className="gradient-brand-text">Simple</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground md:mx-0 md:text-lg">
            Doctors, medicines, lab tests and your reports — one easy app for the whole family, wherever you live.
          </p>
          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row md:items-center">
            <Link
              to="/auth"
              className="group inline-flex items-center justify-center gap-2 rounded-full gradient-brand px-7 py-4 text-base font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
            >
              Open the app <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/patient/ai-assistant"
              className="inline-flex items-center justify-center gap-2 rounded-full glass px-7 py-4 text-base font-semibold transition hover:-translate-y-0.5"
            >
              <Bot className="h-4 w-4 text-primary" /> Ask AI
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground md:justify-start">
            <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-primary" /> 4.8 / 5 from families</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> Works on any PIN code</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> Free to start</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-6 rounded-full bg-brand-soft blur-2xl" aria-hidden />
          <img
            src={heroOrb}
            alt="MEDOOGLE AI connecting doctors, pharmacies, labs and hospitals"
            width={1600}
            height={1200}
            className="animate-float relative w-full"
          />
          <div className="glass absolute -left-2 top-6 hidden items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold shadow-glow sm:flex">
            <Sparkles className="h-4 w-4 text-primary" /> AI reads your report
          </div>
          <div className="glass absolute -right-2 bottom-8 hidden items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold shadow-glow sm:flex">
            <Stethoscope className="h-4 w-4 text-primary" /> Doctor in 2 minutes
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-4">
      <dl className="grid grid-cols-2 gap-3 rounded-3xl border border-border/60 bg-card/70 p-5 backdrop-blur md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.l} className="text-center">
            <dt className="gradient-brand-text text-2xl font-semibold tracking-tight md:text-3xl">{s.v}</dt>
            <dd className="mt-0.5 text-xs text-muted-foreground md:text-sm">{s.l}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function BigButtons() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-10" id="features">
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">What do you need today?</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">Tap one big button — that's the whole app.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className={`group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br ${a.tint} p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow ${
              "big" in a && a.big ? "sm:col-span-2 lg:col-span-1 lg:row-span-2 lg:flex-col lg:items-start lg:justify-end lg:p-7" : ""
            }`}
          >
            <span
              aria-hidden
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-card shadow-sm transition-transform duration-300 group-hover:scale-105 ${a.color}`}
            >
              <a.icon className="h-7 w-7" />
            </span>
            <span className="min-w-0">
              <span className={`block text-lg font-semibold tracking-tight ${a.color}`}>{a.label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{a.hint}</span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 lg:ml-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function Emergency() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-destructive/25 bg-destructive/5 p-5">
        <div className="flex items-center gap-3">
          <span className="animate-pulse-ring grid h-12 w-12 place-items-center rounded-2xl bg-card text-destructive">
            <Siren className="h-5 w-5" />
          </span>
          <div>
            <p className="text-base font-semibold text-destructive">Emergency?</p>
            <p className="text-sm text-muted-foreground">Ambulance and nearest hospital in one tap.</p>
          </div>
        </div>
        <a
          href="tel:108"
          className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-3 text-base font-semibold text-destructive-foreground shadow-glow transition hover:-translate-y-0.5"
        >
          <Phone className="h-4 w-4" /> Call 108
        </a>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">How it works</h2>
      <div className="mt-7 grid gap-3 md:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="rounded-3xl border border-border/60 bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full gradient-brand text-sm font-bold text-primary-foreground shadow-glow">
              {s.n}
            </span>
            <p className="mt-4 text-base font-semibold">{s.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Voices() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-8">
      <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">Loved in small towns</h2>
      <div className="mt-7 grid gap-3 md:grid-cols-3">
        {VOICES.map((v) => (
          <figure key={v.n} className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur">
            <div aria-hidden className="flex gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed">“{v.q}”</blockquote>
            <figcaption className="mt-4 text-xs font-semibold text-muted-foreground">
              {v.n} · {v.c}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-6">
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
    <section className="mx-auto max-w-5xl px-6 pb-24 pt-6 text-center">
      <div className="relative overflow-hidden rounded-[2rem] gradient-brand p-10 text-primary-foreground shadow-glow">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-foreground/10 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary-foreground/10 blur-2xl" />
        <h2 className="relative text-2xl font-semibold tracking-tight md:text-4xl">Start with MEDOOGLE AI today</h2>
        <p className="relative mx-auto mt-3 max-w-md text-sm text-primary-foreground/85 md:text-base">
          Free to use. Sign in with your mobile number and get help in minutes.
        </p>
        <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/auth" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-card px-7 py-3.5 text-base font-semibold text-primary transition hover:-translate-y-0.5 sm:w-auto">
            Open the app <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contact" className="inline-flex w-full items-center justify-center rounded-full border border-primary-foreground/40 px-7 py-3.5 text-base font-semibold text-primary-foreground transition hover:bg-primary-foreground/10 sm:w-auto">
            Contact sales
          </Link>
        </div>
      </div>
    </section>
  );
}
