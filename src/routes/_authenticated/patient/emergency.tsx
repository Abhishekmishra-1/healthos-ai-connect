import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Siren, Phone, MapPin, Ambulance, Hospital, Droplet, Users, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/emergency")({
  head: () => ({ meta: [{ title: "Emergency — HealthOS AI" }] }),
  component: EmergencyPage,
});

const HOSPITALS = [
  { name: "Ruby Hall Clinic", dist: "1.4 km", phone: "020-6645-5555" },
  { name: "Jehangir Hospital", dist: "2.1 km", phone: "020-6681-9999" },
  { name: "Sahyadri Hospital", dist: "3.0 km", phone: "020-6721-3000" },
];

const BLOOD_BANKS = [
  { name: "Red Cross Blood Bank", dist: "1.8 km", phone: "020-2612-7118" },
  { name: "Janakalyan Blood Bank", dist: "2.6 km", phone: "020-2544-3232" },
];

export function EmergencyPage() {
  const [sharing, setSharing] = useState(false);
  const [loc, setLoc] = useState<string | null>(null);

  async function share() {
    setSharing(true);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 }),
      );
      const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
      setLoc(url);
      if (navigator.share) await navigator.share({ title: "My location — emergency", url });
      else await navigator.clipboard.writeText(url);
    } catch { /* ignore */ }
    finally { setSharing(false); }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight md:text-4xl">
          <Siren className="h-7 w-7 text-red-500" /> Emergency
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">One-tap access to ambulance, hospitals and blood banks.</p>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-500/20 via-orange-500/10 to-transparent p-8 text-center">
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/30 blur-2xl" />
        <a href="tel:108" className="relative mx-auto grid h-32 w-32 place-items-center rounded-full bg-red-500 text-white shadow-glow hover:bg-red-600">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-500" />
          <div className="relative text-center">
            <Ambulance className="mx-auto h-8 w-8" />
            <p className="mt-1 text-lg font-bold">SOS</p>
          </div>
        </a>
        <p className="relative mt-4 text-sm font-semibold text-red-500">Tap to call 108 Ambulance</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <button onClick={share} disabled={sharing} className="flex items-center gap-3 rounded-3xl border border-border/60 bg-card p-4 text-left hover:shadow-glow">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-500/10 text-red-500">{sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Share live location</p>
            <p className="truncate text-xs text-muted-foreground">{loc ?? "Sends coordinates to emergency contact"}</p>
          </div>
        </button>
        <a href="tel:102" className="flex items-center gap-3 rounded-3xl border border-border/60 bg-card p-4 hover:shadow-glow">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-500/10 text-red-500"><Phone className="h-4 w-4" /></span>
          <div><p className="text-sm font-semibold">Maternity 102</p><p className="text-xs text-muted-foreground">Free ambulance</p></div>
        </a>
        <a href="tel:1075" className="flex items-center gap-3 rounded-3xl border border-border/60 bg-card p-4 hover:shadow-glow">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-500/10 text-red-500"><Phone className="h-4 w-4" /></span>
          <div><p className="text-sm font-semibold">Health helpline 1075</p><p className="text-xs text-muted-foreground">24×7 support</p></div>
        </a>
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Hospital className="h-4 w-4" /> Nearby hospitals</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {HOSPITALS.map((h) => (
            <div key={h.name} className="flex items-center justify-between gap-3 rounded-3xl border border-border/60 bg-card p-4">
              <div>
                <p className="text-sm font-semibold">{h.name}</p>
                <p className="text-xs text-muted-foreground">{h.dist} away</p>
              </div>
              <a href={`tel:${h.phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-1 rounded-full gradient-brand px-3 py-1.5 text-xs font-semibold text-white shadow-glow">
                <Phone className="h-3 w-3" /> Call
              </a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Droplet className="h-4 w-4 text-red-500" /> Blood banks</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {BLOOD_BANKS.map((b) => (
            <div key={b.name} className="flex items-center justify-between gap-3 rounded-3xl border border-border/60 bg-card p-4">
              <div>
                <p className="text-sm font-semibold">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.dist} away</p>
              </div>
              <a href={`tel:${b.phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white">
                <Phone className="h-3 w-3" /> Call
              </a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Users className="h-4 w-4" /> Emergency contacts</h2>
        <div className="rounded-3xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          Add emergency contacts in your profile to auto-notify them in one tap.
        </div>
      </section>
    </div>
  );
}