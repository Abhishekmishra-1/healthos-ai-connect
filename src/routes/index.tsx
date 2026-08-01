import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Pill,
  Stethoscope,
  FlaskConical,
  FileHeart,
  Siren,
  Users,
  Bell,
  ShieldCheck,
  Building2,
  Ambulance,
  Syringe,
  HeartPulse,
  Check,
  Play,
  Star,
  Languages,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import heroOrb from "@/assets/hero-orb.png";
import appMockup from "@/assets/app-mockup.png";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <PageShell>
      <Hero />
      <TrustBar />
      <EcosystemGrid />
      <AIAssistantSection />
      <MedicineSection />
      <DoctorSection />
      <RecordsSection />
      <EmergencySection />
      <FamilySection />
      <HowItWorks />
      <Membership />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </PageShell>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-36 md:pt-44">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Now live in 240+ Tier 2 & Tier 3 towns
          </span>
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight md:text-7xl">
            One platform.
            <br />
            <span className="gradient-brand-text">Every healthcare need.</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground md:text-xl">
            MEDOOGLE AI connects local pharmacies, doctors, labs, hospitals, and ambulances into
            one intelligent network — designed for every Indian family, in Hindi and English.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-95"
            >
              Request a demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/demo/patient"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-semibold text-foreground"
            >
              <Play className="h-4 w-4" /> Watch demo
            </Link>
            <Link
              to="/partners"
              className="inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              Partner with us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-8 text-left">
            {[
              { k: "1.2M+", v: "Families served" },
              { k: "8,400+", v: "Partner pharmacies" },
              { k: "22 min", v: "Avg. delivery" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="text-2xl font-semibold tracking-tight md:text-3xl">{s.k}</dt>
                <dd className="mt-1 text-xs text-muted-foreground md:text-sm">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-8 -z-10 gradient-mesh blur-2xl" />
          <img
            src={heroOrb}
            alt="MEDOOGLE AI healthcare network"
            width={1600}
            height={1200}
            className="animate-float mx-auto w-full max-w-[560px] drop-shadow-[0_40px_60px_rgba(103,80,220,0.25)]"
          />
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Trusted by clinicians, chemists and families across India
      </p>
      <div className="mt-6 grid grid-cols-2 items-center gap-6 opacity-70 md:grid-cols-6">
        {["Apollo Circle", "Manipal Rural", "PathKind", "Redcliffe", "Netmeds Local", "IMA Rural"].map((n) => (
          <div key={n} className="text-center text-sm font-semibold tracking-tight text-muted-foreground">
            {n}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Ecosystem ---------- */
const ecosystem = [
  { icon: Sparkles, title: "AI Health Assistant", desc: "Ask in Hindi or English. Understand prescriptions, reports, and symptoms in seconds." },
  { icon: Pill, title: "Medicine Delivery", desc: "Search, compare, and get medicines home from your neighborhood chemist." },
  { icon: Stethoscope, title: "Doctor Consultations", desc: "Book by specialty, language, and location. Video or in-clinic." },
  { icon: FlaskConical, title: "Pathology & Labs", desc: "Home sample collection with AI-explained reports." },
  { icon: FileHeart, title: "Digital Health Records", desc: "One secure timeline for your entire family." },
  { icon: Bell, title: "Medicine Reminders", desc: "Daily voice reminders in Hindi. Family alerts for missed doses." },
  { icon: Siren, title: "Emergency Mode", desc: "One tap for ambulance, live location, and nearest hospital." },
  { icon: Users, title: "Family Health", desc: "Parents, kids, pregnancy — one account, everyone covered." },
  { icon: Building2, title: "Hospital Network", desc: "Real-time bed availability and cashless partner hospitals." },
  { icon: Ambulance, title: "Ambulance Dispatch", desc: "Fastest verified ambulance, tracked end-to-end." },
  { icon: Syringe, title: "Vaccinations", desc: "Track children's schedules and adult booster reminders." },
  { icon: HeartPulse, title: "Home Nursing & Physio", desc: "Verified caregivers for elderly and recovery care." },
];

function EcosystemGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24" id="features">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground">
          The operating system for healthcare
        </span>
        <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          A complete network in <span className="gradient-brand-text">one app.</span>
        </h2>
        <p className="mt-4 text-balance text-muted-foreground">
          Twelve services, one intelligent layer. Built to replace the messy web of chemists,
          clinics and clipboards with one calm, connected experience.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ecosystem.map((e, i) => (
          <div
            key={e.title}
            className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 transition duration-500 hover:-translate-y-1 hover:shadow-glow"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full gradient-brand opacity-0 blur-3xl transition group-hover:opacity-30" />
            <div className="inline-grid h-11 w-11 place-items-center rounded-2xl gradient-brand text-white shadow-glow">
              <e.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{e.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Feature sections ---------- */
function FeatureSplit({
  eyebrow,
  title,
  description,
  bullets,
  visual,
  reverse,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className={`grid items-center gap-16 md:grid-cols-2 ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}>
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest gradient-brand-text">{eyebrow}</span>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full gradient-brand text-white">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">{visual}</div>
      </div>
    </section>
  );
}

function AIAssistantSection() {
  return (
    <FeatureSplit
      eyebrow="AI Health Assistant"
      title={<>Your family doctor in your pocket — in <span className="gradient-brand-text">your language.</span></>}
      description="Ask about a prescription in Hindi. Snap a lab report. Type a symptom in English. Aarogya, our multilingual AI, replies in plain words your grandmother would understand — and always tells you when a real doctor is needed."
      bullets={[
        "Hindi, English, Marathi, Tamil, Telugu, Bengali and Kannada",
        "Explains prescriptions & lab reports in simple language",
        "Never replaces a doctor — always suggests the right next step",
      ]}
      visual={
        <div className="relative rounded-[2rem] glass p-6 shadow-glow">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl gradient-brand text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Aarogya AI</p>
              <p className="text-xs text-muted-foreground">Online · replies in seconds</p>
            </div>
            <Languages className="ml-auto h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-5 space-y-3">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-secondary px-4 py-2.5 text-sm">
              मेरे papa की BP report में LDL 168 है, क्या करना चाहिए?
            </div>
            <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm">
              <p>LDL 168 थोड़ा ज़्यादा है — इसे "bad cholesterol" कहते हैं. आमतौर पर इसे 100 से नीचे रखना अच्छा होता है.</p>
              <p className="mt-2 text-muted-foreground">यह medical advice नहीं है. मैं <span className="text-foreground font-medium">Dr. Sharma (Cardiology, 2.1 km)</span> के साथ appointment book कर सकती हूँ?</p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-full gradient-brand px-3 py-1.5 text-xs font-semibold text-white">Book visit</button>
                <button className="rounded-full border border-border px-3 py-1.5 text-xs font-medium">Explain more</button>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-3">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Ask anything in Hindi or English…</span>
          </div>
        </div>
      }
    />
  );
}

function MedicineSection() {
  return (
    <FeatureSplit
      reverse
      eyebrow="Medicine Delivery"
      title={<>Every medicine, from <span className="gradient-brand-text">your local chemist.</span></>}
      description="We don't replace your neighborhood pharmacy — we power it. Search any medicine, see real-time availability across nearby partners, compare prices, and get it home in minutes."
      bullets={[
        "Real inventory from 8,400+ verified pharmacies",
        "Upload handwritten prescriptions — AI reads them",
        "Generic alternatives with instant savings",
      ]}
      visual={
        <div className="rounded-[2rem] glass p-5 shadow-glow">
          <div className="rounded-2xl border border-border bg-background/60 px-4 py-3">
            <p className="text-xs text-muted-foreground">Searching near Nashik, MH</p>
            <p className="mt-1 text-base font-medium">Telmisartan 40mg</p>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { name: "Rathi Medical Store", eta: "18 min", price: "₹84", tag: "Closest" },
              { name: "Ganesh Chemists", eta: "24 min", price: "₹78", tag: "Cheapest" },
              { name: "Apollo Franchise", eta: "35 min", price: "₹96", tag: "In stock" },
            ].map((p) => (
              <div key={p.name} className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {p.eta} · {p.tag}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold">{p.price}</p>
                  <button className="mt-1 text-xs font-semibold gradient-brand-text">Add →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

function DoctorSection() {
  return (
    <FeatureSplit
      eyebrow="Doctor Consultations"
      title={<>Doctors who speak <span className="gradient-brand-text">your language.</span></>}
      description="Filter by specialty, language, distance, and price. Book a video consult in 12 minutes, or an in-clinic visit for tomorrow morning."
      bullets={[
        "12,000+ verified doctors across 32 specialties",
        "Free follow-ups within 7 days",
        "Digital prescriptions delivered instantly",
      ]}
      visual={
        <div className="grid gap-3">
          {[
            { name: "Dr. Rashmi Deshpande", spec: "General Medicine · Hindi, Marathi", eta: "Next slot 4:20 PM", price: "₹299" },
            { name: "Dr. Anwar Khan", spec: "Pediatrics · Hindi, Urdu, English", eta: "Available now", price: "₹399" },
            { name: "Dr. Sunita Rao", spec: "Gynaecology · Kannada, English", eta: "Tomorrow 10:00 AM", price: "₹499" },
          ].map((d) => (
            <div key={d.name} className="flex items-center gap-4 rounded-3xl glass p-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl gradient-brand text-white text-lg font-semibold">
                {d.name.split(" ")[1][0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{d.name}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{d.spec}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {d.eta}
                </p>
              </div>
              <button className="shrink-0 rounded-full gradient-brand px-4 py-2 text-xs font-semibold text-white">
                {d.price}
              </button>
            </div>
          ))}
        </div>
      }
    />
  );
}

function RecordsSection() {
  return (
    <FeatureSplit
      reverse
      eyebrow="Digital Health Records"
      title={<>Every report, prescription and visit — <span className="gradient-brand-text">one timeline.</span></>}
      description="No more shoeboxes of paper reports. MEDOOGLE quietly organizes your family's entire medical history — searchable, sharable, and secure."
      bullets={[
        "ABDM-compliant, end-to-end encrypted",
        "Automatic timeline across doctors and labs",
        "Share with any doctor via secure QR",
      ]}
      visual={
        <div className="rounded-[2rem] glass p-6 shadow-glow">
          <ol className="relative space-y-6 border-l-2 border-border pl-5">
            {[
              { d: "Today", t: "Blood Test — Lipid Profile", s: "PathKind · AI summary ready" },
              { d: "2 days ago", t: "Consultation with Dr. Rao", s: "Prescribed Amlodipine 5mg" },
              { d: "Last week", t: "Home BP monitoring", s: "7-day trend: stable" },
              { d: "3 weeks ago", t: "Annual Health Check", s: "Full report archived" },
            ].map((item) => (
              <li key={item.t}>
                <span className="absolute -left-[9px] mt-1 grid h-4 w-4 place-items-center rounded-full gradient-brand ring-4 ring-background" />
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.d}</p>
                <p className="mt-1 text-sm font-semibold">{item.t}</p>
                <p className="text-xs text-muted-foreground">{item.s}</p>
              </li>
            ))}
          </ol>
        </div>
      }
    />
  );
}

function EmergencySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] gradient-brand p-10 text-white md:p-16">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(60%_60%_at_80%_20%,white,transparent_60%)]" />
        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Siren className="h-3.5 w-3.5" /> Emergency Mode
            </span>
            <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              One tap. Help on the way.
            </h2>
            <p className="mt-4 max-w-lg text-white/85">
              Press and hold the SOS button. MEDOOGLE finds the nearest verified ambulance, shares
              your live location, and alerts up to five family members automatically.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
              {[
                { k: "3.8 min", v: "Avg. dispatch" },
                { k: "24/7", v: "Always on" },
                { k: "PAN India", v: "Cross-state" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                  <p className="text-lg font-semibold">{s.k}</p>
                  <p className="text-xs text-white/75">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-auto grid h-56 w-56 place-items-center md:h-72 md:w-72">
            <div className="absolute h-56 w-56 rounded-full bg-white/10 animate-pulse-ring md:h-72 md:w-72" />
            <div className="absolute h-40 w-40 rounded-full bg-white/15 animate-pulse-ring md:h-52 md:w-52" style={{ animationDelay: "0.6s" }} />
            <button className="relative grid h-36 w-36 place-items-center rounded-full bg-white text-primary shadow-2xl md:h-44 md:w-44">
              <span className="text-2xl font-bold">SOS</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FamilySection() {
  return (
    <FeatureSplit
      eyebrow="Family Health"
      title={<>Take care of everyone, from <span className="gradient-brand-text">one account.</span></>}
      description="Track your parents' medicines from another city. Never miss your child's vaccine. Follow your pregnancy week by week — all in one calm dashboard."
      bullets={[
        "Add up to 8 family members",
        "Elderly parent monitoring with SMS fallback",
        "Children vaccination + pregnancy tracker",
      ]}
      visual={
        <img
          src={appMockup}
          alt="MEDOOGLE mobile app"
          width={1200}
          height={1408}
          loading="lazy"
          className="mx-auto w-full max-w-[420px] drop-shadow-[0_40px_60px_rgba(103,80,220,0.25)]"
        />
      }
    />
  );
}

/* ---------- How it works ---------- */
function HowItWorks() {
  const steps = [
    { n: "01", t: "Create your family profile", d: "Add members, allergies, existing conditions, and language preference." },
    { n: "02", t: "Connect your local ecosystem", d: "We auto-detect nearby verified pharmacies, doctors, and labs." },
    { n: "03", t: "Live intelligently", d: "AI takes care of reminders, records, refills, and emergencies — you just live." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest gradient-brand-text">How it works</span>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          Set up in 3 minutes. Set for a lifetime.
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-3xl border border-border/60 bg-card p-8">
            <p className="text-5xl font-semibold tracking-tighter gradient-brand-text">{s.n}</p>
            <h3 className="mt-6 text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Membership ---------- */
function Membership() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="overflow-hidden rounded-[2.5rem] border border-border/60 bg-card p-10 md:p-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5" /> MEDOOGLE Care Membership
            </span>
            <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              ₹99/month. Care for the whole family.
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Unlimited AI consults, free doctor follow-ups, priority ambulance, 12% off medicines,
              and one annual full-body health check for every family member.
            </p>
          </div>
          <ul className="grid gap-3 md:grid-cols-2">
            {[
              "Unlimited AI health assistant",
              "24/7 doctor on call",
              "Free medicine delivery",
              "Priority ambulance",
              "12% off medicines",
              "Annual full body check",
              "Home nursing discounts",
              "No hidden fees, ever",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 rounded-2xl border border-border/60 bg-background/40 p-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */
const testimonials = [
  {
    q: "मेरी माँ की दवाइयाँ अब हर हफ्ते time पर घर आ जाती हैं. मुझे Mumbai से याद रखने की ज़रूरत नहीं.",
    a: "Meera Iyer",
    r: "Daughter · caring for mother in Solapur",
    img: testimonial1,
  },
  {
    q: "As a rural GP I finally have digital records, e-prescriptions, and lab integration in one place. Zero setup.",
    a: "Dr. Rohan Kulkarni",
    r: "General Physician · Sangli",
    img: testimonial2,
  },
  {
    q: "गाँव में पहले सबसे नज़दीक hospital 40 km था. अब ambulance 10 minute में आ जाती है.",
    a: "Ramesh Patel",
    r: "Farmer · village near Bhuj",
    img: testimonial3,
  },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest gradient-brand-text">Loved across India</span>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          Stories from the network.
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.a} className="flex flex-col rounded-3xl border border-border/60 bg-card p-8">
            <div className="flex gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground/90">
              "{t.q}"
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
              <img src={t.img} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold">{t.a}</p>
                <p className="text-xs text-muted-foreground">{t.r}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */
function Pricing() {
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
  return (
    <section className="mx-auto max-w-7xl px-6 py-24" id="pricing">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest gradient-brand-text">Pricing</span>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          Fair, transparent, built for Bharat.
        </h2>
      </div>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative flex flex-col rounded-3xl border p-8 ${
              p.highlighted
                ? "border-transparent gradient-brand text-white shadow-glow"
                : "border-border/60 bg-card"
            }`}
          >
            {p.highlighted && (
              <span className="absolute right-6 top-6 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                Most loved
              </span>
            )}
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
                p.highlighted
                  ? "bg-white text-primary hover:bg-white/90"
                  : "border border-border bg-background hover:bg-secondary"
              }`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const items = [
    { q: "Is MEDOOGLE AI a replacement for a doctor?", a: "No. Our AI helps you understand your health and connects you to the right doctor — but every diagnosis and prescription is issued by a licensed professional." },
    { q: "Does it work in Hindi and regional languages?", a: "Yes. MEDOOGLE speaks Hindi, Marathi, Tamil, Telugu, Bengali, and Kannada — with voice input and voice reminders." },
    { q: "Do you deliver to villages and small towns?", a: "We are live in 240+ Tier 2 and Tier 3 cities, and expanding to blocks and panchayat-level towns every week." },
    { q: "Is my medical data safe?", a: "Yes. MEDOOGLE is ABDM-compliant, end-to-end encrypted, and you control who sees what. We never sell your data." },
    { q: "How does the ambulance service work?", a: "One tap on SOS locates the nearest verified ambulance, shares your live location, and alerts your family. Average dispatch time is 3.8 minutes." },
    { q: "Can my local chemist join the network?", a: "Absolutely. Any licensed pharmacy can join in under 15 minutes with our free partner app. No setup fees." },
  ];
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-widest gradient-brand-text">FAQ</span>
        <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          Questions, answered.
        </h2>
      </div>
      <div className="mt-12 space-y-3">
        {items.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-border/60 bg-card p-6 open:shadow-glow">
            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold">
              {f.q}
              <span className="ml-4 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-lg leading-none transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card p-12 text-center md:p-20">
        <div className="pointer-events-none absolute inset-0 -z-10 gradient-mesh" />
        <span className="inline-flex items-center rounded-full glass px-3 py-1 text-xs font-medium">The future of healthcare, today.</span>
        <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
          Give your family the healthcare
          <br />
          they <span className="gradient-brand-text">deserve.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-balance text-muted-foreground">
          Join 1.2 million Indian families already living on MEDOOGLE AI.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow">
            Contact sales <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/partners" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-semibold">
            Partner with us
          </Link>
        </div>
      </div>
    </section>
  );
}
