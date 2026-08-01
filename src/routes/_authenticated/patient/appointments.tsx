import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, Video, MapPin, Clock, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BookDoctorDialog, type BookingRequest } from "@/components/patient/book-doctor-dialog";
import { type AppointmentMode, MODE_LABEL, formatWhen, slotMinutes, todayISO } from "@/lib/appointments";

export const Route = createFileRoute("/_authenticated/patient/appointments")({
  head: () => ({ meta: [{ title: "Appointments — MEDOOGLE AI" }] }),
  component: AppointmentsPage,
});

type Row = {
  id: string;
  doctor_name: string;
  doctor_specialty: string | null;
  clinic: string | null;
  mode: string;
  fee: number;
  slot_date: string;
  slot_time: string;
  reason: string | null;
  status: string;
};

function isPast(r: Row) {
  const today = todayISO();
  if (r.slot_date < today) return true;
  if (r.slot_date > today) return false;
  const now = new Date();
  return slotMinutes(r.slot_time) < now.getHours() * 60 + now.getMinutes();
}

function ModeIcon({ mode }: { mode: string }) {
  if (mode === "clinic") return <MapPin className="h-3.5 w-3.5" />;
  if (mode === "chat") return <MessageCircle className="h-3.5 w-3.5" />;
  return <Video className="h-3.5 w-3.5" />;
}

export function AppointmentsPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [booking, setBooking] = useState<BookingRequest | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("id, doctor_name, doctor_specialty, clinic, mode, fee, slot_date, slot_time, reason, status")
      .order("slot_date", { ascending: true });
    if (error) {
      toast.error("Could not load appointments.");
      setRows([]);
      return;
    }
    setRows(data as Row[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function cancel(r: Row) {
    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", r.id);
    if (error) {
      toast.error("Could not cancel. Please try again.");
      return;
    }
    toast.success("Appointment cancelled.");
    load();
  }

  const upcoming = (rows ?? []).filter((r) => r.status !== "cancelled" && !isPast(r));
  const past = (rows ?? []).filter((r) => r.status === "cancelled" || isPast(r));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Appointments</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your video and in-clinic consultations.</p>
        </div>
        <Link to="/patient/doctors" className="rounded-full gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow">Book new</Link>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Upcoming</h2>
        {rows === null ? (
          <div className="flex items-center gap-2 rounded-3xl border border-dashed p-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your appointments…
          </div>
        ) : upcoming.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No upcoming appointments.{" "}
            <Link to="/patient/doctors" className="font-semibold text-primary">Book a doctor</Link>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {upcoming.map((a) => (
              <div key={a.id} className="rounded-3xl border border-border/60 bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand text-white shadow-glow"><CalendarCheck className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{a.doctor_name}</p>
                    <p className="text-xs text-muted-foreground">{a.doctor_specialty}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <p className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {formatWhen(a.slot_date, a.slot_time)}</p>
                  <p className="inline-flex items-center gap-1"><ModeIcon mode={a.mode} /> {MODE_LABEL[a.mode as AppointmentMode] ?? a.mode}{a.clinic ? ` · ${a.clinic}` : ""}</p>
                  {a.reason && <p>Reason: {a.reason}</p>}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold">₹{a.fee}</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => cancel(a)}
                      className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBooking({
                          doctor: {
                            name: a.doctor_name,
                            spec: a.doctor_specialty ?? "",
                            clinic: a.clinic,
                            fee: a.fee,
                          },
                          mode: (a.mode as AppointmentMode) ?? "video",
                          rescheduleId: a.id,
                        })
                      }
                      className="rounded-full gradient-brand px-3 py-1.5 text-xs font-semibold text-white shadow-glow"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Past</h2>
        {past.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-8 text-center text-sm text-muted-foreground">Nothing here yet.</div>
        ) : (
          <div className="divide-y divide-border/60 rounded-3xl border border-border/60 bg-card">
            {past.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-semibold">{a.doctor_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.doctor_specialty} · {formatWhen(a.slot_date, a.slot_time)} · {MODE_LABEL[a.mode as AppointmentMode] ?? a.mode}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${a.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-secondary"}`}>
                  {a.status === "cancelled" ? "Cancelled" : "Completed"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <BookDoctorDialog request={booking} onClose={() => setBooking(null)} onBooked={load} />
    </div>
  );
}