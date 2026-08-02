const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

/** Fixed sender: the connected Gmail account for MEDOOGLE AI. */
export const SENDER = "MEDOOGLE AI <avinashjain1228@gmail.com>";

function base64url(input: string) {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendGmail(opts: { to: string; subject: string; html: string }) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_MAIL_API_KEY"];
  if (!lovableKey || !connectionKey) throw new Error("Gmail connection is not configured");

  const raw = base64url(
    [
      `From: ${SENDER}`,
      `To: ${opts.to}`,
      `Subject: ${opts.subject}`,
      "MIME-Version: 1.0",
      'Content-Type: text/html; charset="UTF-8"',
      "",
      opts.html,
    ].join("\r\n"),
  );

  const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
    },
    body: JSON.stringify({ raw }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Gmail send failed [${res.status}]: ${body}`);
    throw new Error(`Gmail send failed [${res.status}]: ${body}`);
  }
  return { sent: true as const };
}

export function bookingEmailHtml(a: {
  patientName: string;
  doctorName: string;
  specialty: string;
  when: string;
  mode: string;
  clinic: string | null;
  fee: number;
  reason: string | null;
  rescheduled: boolean;
}) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:#64748b;font-size:14px">${label}</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#0f172a">${value}</td></tr>`;
  return `<div style="font-family:Arial,Helvetica,sans-serif;background:#ffffff;padding:24px">
  <div style="max-width:520px;margin:0 auto;border:1px solid #e2e8f0;border-radius:16px;padding:24px">
    <p style="margin:0 0 4px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#0d9488;font-weight:700">MEDOOGLE AI</p>
    <h1 style="margin:0 0 12px;font-size:22px;color:#0f172a">${a.rescheduled ? "Appointment rescheduled" : "Appointment confirmed"}</h1>
    <p style="margin:0 0 18px;font-size:15px;color:#334155">Hi ${a.patientName}, your appointment is ${a.rescheduled ? "updated" : "booked"}.</p>
    <table style="width:100%;border-collapse:collapse">
      ${row("Doctor", `${a.doctorName}${a.specialty ? ` · ${a.specialty}` : ""}`)}
      ${row("When", a.when)}
      ${row("Type", a.mode)}
      ${a.clinic ? row("Clinic", a.clinic) : ""}
      ${a.reason ? row("Reason", a.reason) : ""}
      ${row("Fee", `Rs. ${a.fee}`)}
    </table>
    <p style="margin:18px 0 0;font-size:13px;color:#64748b">You can view, reschedule or cancel this booking in the app under Appointments.</p>
  </div>
</div>`;
}
