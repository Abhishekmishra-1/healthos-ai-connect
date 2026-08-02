import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  appointmentId: z.string().uuid(),
  rescheduled: z.boolean().optional(),
});

/** Emails the signed-in patient their booking confirmation from the connected Gmail account. */
export const sendBookingConfirmation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data, context }) => {
    const { bookingEmailHtml, sendGmail } = await import("./booking-email.server");
    const { formatWhen, MODE_LABEL } = await import("./appointments");

    const { data: appt, error } = await context.supabase
      .from("appointments")
      .select(
        "doctor_name, doctor_specialty, clinic, mode, fee, slot_date, slot_time, reason, patient_name",
      )
      .eq("id", data.appointmentId)
      .maybeSingle();
    if (error || !appt) return { sent: false as const, reason: "appointment_not_found" };

    const email = (context.claims as { email?: string }).email;
    if (!email) return { sent: false as const, reason: "no_email_on_account" };

    await sendGmail({
      to: email,
      subject: `${data.rescheduled ? "Rescheduled" : "Confirmed"}: ${appt.doctor_name} · ${formatWhen(appt.slot_date, appt.slot_time)}`,
      html: bookingEmailHtml({
        patientName: appt.patient_name ?? "there",
        doctorName: appt.doctor_name,
        specialty: appt.doctor_specialty ?? "",
        when: formatWhen(appt.slot_date, appt.slot_time),
        mode: MODE_LABEL[appt.mode as keyof typeof MODE_LABEL] ?? appt.mode,
        clinic: appt.clinic ?? null,
        fee: appt.fee,
        reason: appt.reason ?? null,
        rescheduled: !!data.rescheduled,
      }),
    });
    return { sent: true as const };
  });
