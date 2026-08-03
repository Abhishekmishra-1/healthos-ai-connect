const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

/** Normalises an Indian mobile number to E.164 (defaults to +91). */
export function toE164(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (digits.length > 10 && digits.length <= 15) return `+${digits}`;
  return null;
}

export function isWhatsAppConfigured() {
  return Boolean(
    process.env["LOVABLE_API_KEY"] &&
      process.env["TWILIO_API_KEY"] &&
      process.env["TWILIO_WHATSAPP_FROM"],
  );
}

/** Sends a WhatsApp text through Twilio (via the Lovable connector gateway). */
export async function sendWhatsApp(opts: { to: string; body: string }) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const twilioKey = process.env["TWILIO_API_KEY"];
  const from = process.env["TWILIO_WHATSAPP_FROM"];
  if (!lovableKey || !twilioKey || !from) {
    return { sent: false as const, reason: "whatsapp_not_configured" };
  }
  const to = toE164(opts.to);
  if (!to) return { sent: false as const, reason: "invalid_number" };

  const res = await fetch(`${GATEWAY_URL}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": twilioKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      To: `whatsapp:${to}`,
      From: from.startsWith("whatsapp:") ? from : `whatsapp:${toE164(from) ?? from}`,
      Body: opts.body,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`WhatsApp send failed [${res.status}]: ${body}`);
    return { sent: false as const, reason: `twilio_${res.status}`, detail: body.slice(0, 400) };
  }
  return { sent: true as const };
}

/** Plain-text WhatsApp message for a booking (short, readable on any phone). */
export function bookingWhatsAppText(a: {
  patientName: string;
  doctorName: string;
  specialty: string;
  when: string;
  mode: string;
  clinic: string | null;
  fee: number;
  rescheduled: boolean;
}) {
  return [
    `*MEDOOGLE AI* — ${a.rescheduled ? "Appointment rescheduled" : "Appointment confirmed"}`,
    "",
    `Hi ${a.patientName},`,
    `Doctor: ${a.doctorName}${a.specialty ? ` (${a.specialty})` : ""}`,
    `When: ${a.when}`,
    `Type: ${a.mode}`,
    ...(a.clinic ? [`Clinic: ${a.clinic}`] : []),
    `Fee: Rs. ${a.fee}`,
    "",
    "You can view, reschedule or cancel in the app under Appointments.",
  ].join("\n");
}