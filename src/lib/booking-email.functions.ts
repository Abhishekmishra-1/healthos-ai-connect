import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  appointmentId: z.string().uuid(),
  rescheduled: z.boolean().optional(),
});

/** Emails + WhatsApps the signed-in patient their booking confirmation. */
export const sendBookingConfirmation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data, context }) => {
    const { bookingEmailHtml, sendGmail } = await import("./booking-email.server");
    const { sendWhatsApp, bookingWhatsAppText } = await import("./whatsapp.server");
    const { formatWhen, MODE_LABEL } = await import("./appointments");

    const { data: appt, error } = await context.supabase
      .from("appointments")
      .select(
        "doctor_name, doctor_specialty, clinic, mode, fee, slot_date, slot_time, reason, patient_name, patient_phone",
      )
      .eq("id", data.appointmentId)
      .maybeSingle();
    if (error || !appt) return { sent: false, whatsapp: false, reason: "appointment_not_found" };

    const email = (context.claims as { email?: string }).email;
    const when = formatWhen(appt.slot_date, appt.slot_time);
    const mode = MODE_LABEL[appt.mode as keyof typeof MODE_LABEL] ?? appt.mode;
    const patientName = appt.patient_name ?? "there";

    let sent = false;
    let emailError: string | null = null;
    if (email) {
      try {
        await sendGmail({
          to: email,
          subject: `${data.rescheduled ? "Rescheduled" : "Confirmed"}: ${appt.doctor_name} · ${when}`,
          html: bookingEmailHtml({
            patientName,
            doctorName: appt.doctor_name,
            specialty: appt.doctor_specialty ?? "",
            when,
            mode,
            clinic: appt.clinic ?? null,
            fee: appt.fee,
            reason: appt.reason ?? null,
            rescheduled: !!data.rescheduled,
          }),
        });
        sent = true;
      } catch (e) {
        emailError = e instanceof Error ? e.message : "email_failed";
      }
    }

    let whatsapp = false;
    let whatsappReason: string | null = "no_phone_on_booking";
    if (appt.patient_phone) {
      const res = await sendWhatsApp({
        to: appt.patient_phone,
        body: bookingWhatsAppText({
          patientName,
          doctorName: appt.doctor_name,
          specialty: appt.doctor_specialty ?? "",
          when,
          mode,
          clinic: appt.clinic ?? null,
          fee: appt.fee,
          rescheduled: !!data.rescheduled,
        }),
      });
      whatsapp = res.sent;
      whatsappReason = res.sent ? null : res.reason;
    }

    await context.supabase.from("notification_log").insert([
      {
        user_id: context.userId,
        appointment_id: data.appointmentId,
        channel: "email",
        destination: email ?? null,
        status: sent ? "sent" : "failed",
        error: sent ? null : (emailError ?? "no_email_on_account"),
      },
      {
        user_id: context.userId,
        appointment_id: data.appointmentId,
        channel: "whatsapp",
        destination: appt.patient_phone ?? null,
        status: whatsapp ? "sent" : "failed",
        error: whatsappReason,
      },
    ]);

    return { sent, whatsapp, whatsappReason, phone: appt.patient_phone ?? null };
  });
