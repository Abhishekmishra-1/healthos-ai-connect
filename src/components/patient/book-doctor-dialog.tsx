import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CalendarCheck, Loader2, MapPin, Video, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { sendBookingConfirmation } from "@/lib/booking-email.functions";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  type AppointmentMode, type BookableDoctor, MODE_LABEL, SLOT_GROUPS,
  fetchBookedSlots, formatDay, isSlotInPast, nextDays,
} from "@/lib/appointments";

const MODES: { key: AppointmentMode; label: string; icon: typeof Video }[] = [
  { key: "video", label: "Video", icon: Video },
  { key: "clinic", label: "In-clinic", icon: MapPin },
  { key: "chat", label: "Chat", icon: MessageCircle },
];

export type BookingRequest = {
  doctor: BookableDoctor;
  mode: AppointmentMode;
  /** When set, the existing appointment is rescheduled instead of created. */
  rescheduleId?: string;
};

export function BookDoctorDialog({
  request,
  onClose,
  onBooked,
}: {
  request: BookingRequest | null;
  onClose: () => void;
  onBooked?: () => void;
}) {
  const navigate = useNavigate();
  const days = nextDays(7);
  const [mode, setMode] = useState<AppointmentMode>("video");
  const [day, setDay] = useState(days[0]!);
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const doctor = request?.doctor;

  // Reset the form each time a new booking is started.
  useEffect(() => {
    if (!request) return;
    setMode(request.mode);
    setDay(days[0]!);
    setSlot(null);
    setReason("");
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const meta = data.user?.user_metadata as { full_name?: string } | undefined;
      if (cancelled) return;
      setName(meta?.full_name ?? "");
      setPhone(data.user?.phone ?? "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .maybeSingle();
      if (cancelled || !profile) return;
      if (profile.full_name) setName(profile.full_name);
      if (profile.phone) setPhone(profile.phone);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  // Refresh taken slots whenever the doctor or date changes.
  useEffect(() => {
    if (!doctor) return;
    let cancelled = false;
    fetchBookedSlots(doctor.name, day).then((slots) => {
      if (!cancelled) setBooked(slots);
    });
    return () => {
      cancelled = true;
    };
  }, [doctor?.name, day, doctor]);

  async function confirm() {
    if (!doctor || !slot) {
      toast.error("Please pick a time slot.");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter the patient name.");
      return;
    }
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;
    if (!userId) {
      setSaving(false);
      toast.error("Please sign in again to book.");
      navigate({ to: "/auth", search: { redirect: "/patient/doctors" } });
      return;
    }
    const payload = {
      patient_id: userId,
      doctor_id: doctor.id ?? null,
      doctor_name: doctor.name,
      doctor_specialty: doctor.spec,
      clinic: mode === "clinic" ? doctor.clinic ?? null : null,
      mode,
      fee: doctor.fee,
      slot_date: day,
      slot_time: slot,
      patient_name: name.trim(),
      patient_phone: phone.trim() || null,
      reason: reason.trim() || null,
      status: "confirmed",
    };
    const { error, data: created } = request?.rescheduleId
      ? await supabase.from("appointments").update(payload).eq("id", request.rescheduleId)
      : await supabase.from("appointments").insert(payload).select("id").maybeSingle();
    const appointmentId = request?.rescheduleId ?? (created as { id?: string } | null)?.id;
    setSaving(false);
    if (error) {
      toast.error(
        error.code === "23505"
          ? "You already have this slot booked with this doctor."
          : error.message || "Could not book. Please try again.",
      );
      return;
    }
    toast.success(
      request?.rescheduleId
        ? "Appointment rescheduled."
        : `Booked with ${doctor.name} · ${formatDay(day)}, ${slot}`,
    );
    if (appointmentId) {
      sendBookingConfirmation({
        data: { appointmentId, rescheduled: !!request?.rescheduleId },
      })
        .then((r) => {
          if (r?.sent) toast.success("Booking details emailed to you.");
        })
        .catch(() => toast.error("Booked, but we could not email the details."));
    }
    onClose();
    onBooked?.();
    if (!request?.rescheduleId) navigate({ to: "/patient/appointments" });
  }

  return (
    <Dialog open={!!request} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {request?.rescheduleId ? "Reschedule" : "Book appointment"}
          </DialogTitle>
          <DialogDescription>
            {doctor ? `${doctor.name} · ${doctor.spec} · ₹${doctor.fee}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">How</p>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMode(m.key)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    mode === m.key ? "gradient-brand text-white shadow-glow" : "bg-secondary text-foreground"
                  }`}
                >
                  <m.icon className="h-4 w-4" /> {m.label}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{MODE_LABEL[mode]}</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Which day</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => { setDay(d); setSlot(null); }}
                  className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    day === d ? "gradient-brand text-white shadow-glow" : "bg-secondary"
                  }`}
                >
                  {formatDay(d)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pick a time</p>
            {SLOT_GROUPS.map((group) => {
              const usable = group.slots.filter((s) => !isSlotInPast(day, s));
              if (usable.length === 0) return null;
              return (
                <div key={group.label}>
                  <p className="mb-1.5 text-xs text-muted-foreground">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {usable.map((s) => {
                      const taken = booked.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={taken}
                          onClick={() => setSlot(s)}
                          className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                            taken
                              ? "cursor-not-allowed border-border/50 text-muted-foreground line-through opacity-60"
                              : slot === s
                                ? "border-transparent gradient-brand text-white shadow-glow"
                                : "border-border/60 bg-card hover:border-primary/50"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Patient name"
              className="rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile number"
              inputMode="tel"
              className="rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Problem (e.g. fever, cough)"
              className="rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm outline-none focus:border-primary sm:col-span-2"
            />
          </div>

          <button
            type="button"
            onClick={confirm}
            disabled={saving || !slot}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full gradient-brand px-6 py-3.5 text-base font-semibold text-white shadow-glow disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4" />}
            {slot ? `Confirm ${formatDay(day)}, ${slot}` : "Select a time slot"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}