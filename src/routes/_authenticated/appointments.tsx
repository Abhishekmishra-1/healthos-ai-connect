import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, Video, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/appointments")({
  head: () => ({ meta: [{ title: "Appointments — HealthOS AI" }] }),
  component: AppointmentsPage,
});

const UPCOMING = [
  { doctor: "Dr. Priya Sharma", spec: "General Physician", when: "Tomorrow, 10:30 AM", mode: "Video", fee: 399 },
  { doctor: "Dr. Ananya Iyer", spec: "Pediatrics", when: "Fri, 4:00 PM", mode: "In-clinic", fee: 499, clinic: "Little Steps, Aundh" },
];
const PAST = [
  { doctor: "Dr. Rahul Verma", spec: "Cardiology", when: "12 Jun · 6:15 PM", mode: "Video" },
  { doctor: "Dr. Meera Nair", spec: "Gynecology", when: "28 May · 11:00 AM", mode: "In-clinic" },
];

export function AppointmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Appointments</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your video and in-clinic consultations.</p>
        </div>
        <Link to="/app/doctors" className="rounded-full gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow">Book new</Link>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Upcoming</h2>
        {UPCOMING.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-8 text-center text-sm text-muted-foreground">No upcoming appointments.</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {UPCOMING.map((a) => (
              <div key={a.doctor} className="rounded-3xl border border-border/60 bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand text-white shadow-glow"><CalendarCheck className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{a.doctor}</p>
                    <p className="text-xs text-muted-foreground">{a.spec}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <p className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {a.when}</p>
                  <p className="inline-flex items-center gap-1">{a.mode === "Video" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />} {a.mode}{a.clinic ? ` · ${a.clinic}` : ""}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold">₹{a.fee}</span>
                  <div className="flex gap-1.5">
                    <button className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">Reschedule</button>
                    <button className="rounded-full gradient-brand px-3 py-1.5 text-xs font-semibold text-white shadow-glow">Join</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Past</h2>
        <div className="divide-y divide-border/60 rounded-3xl border border-border/60 bg-card">
          {PAST.map((a) => (
            <div key={a.doctor} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-semibold">{a.doctor}</p>
                <p className="text-xs text-muted-foreground">{a.spec} · {a.when} · {a.mode}</p>
              </div>
              <button className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">View summary</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}