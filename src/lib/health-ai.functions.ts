import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

async function fetchFileAsDataUrl(
  supabase: any,
  bucket: string,
  path: string,
): Promise<{ dataUrl: string; bytes: Uint8Array; mime: string }> {
  const { data, error } = await supabase.storage.from(bucket).download(path);
  if (error || !data) throw new Error(error?.message ?? "File not found");
  const bytes = new Uint8Array(await data.arrayBuffer());
  const buf = Buffer.from(bytes);
  const mime = data.type || "application/octet-stream";
  return { dataUrl: `data:${mime};base64,${buf.toString("base64")}`, bytes, mime };
}

function extractJson(text: string): any {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in AI response");
  return JSON.parse(raw.slice(start, end + 1));
}

/* -------- Prescription analysis -------- */
export const analyzePrescription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ prescriptionId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const { supabase, userId } = context;

    const { data: row, error } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("id", data.prescriptionId)
      .eq("user_id", userId)
      .single();
    if (error || !row) throw new Error("Prescription not found");

    const { dataUrl, bytes, mime } = await fetchFileAsDataUrl(supabase, "prescriptions", row.file_path);

    const gateway = createLovableAiGatewayProvider(key);
    const isImage = mime.startsWith("image/");

    const { text } = await generateText({
      model: gateway(MODEL),
      messages: [
        {
          role: "system",
          content:
            "You are a friendly medical assistant helping Indian patients understand their prescriptions. Always reply with ONLY valid JSON, no prose, no markdown fences.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract medicines from this prescription image. For each medicine include: name, dosage, frequency, duration, food_timing (one of "before food", "after food", "with food", or ""), purpose (one plain-English sentence), side_effects (array of 2-4 short plain-English strings). Also include doctor_name, clinic_name if visible, and a short summary in simple English (max 3 sentences). Return JSON: { "doctor_name": string|null, "clinic_name": string|null, "summary": string, "medicines": [ { "name": string, "dosage": string, "frequency": string, "duration": string, "food_timing": string, "purpose": string, "side_effects": string[] } ] }`,
            },
            isImage
              ? { type: "image" as const, image: dataUrl }
              : { type: "file" as const, data: bytes, mediaType: mime },
          ],
        },
      ],
    });

    let analysis: any;
    try {
      analysis = extractJson(text);
    } catch {
      analysis = { summary: text, medicines: [] };
    }
    analysis.disclaimer =
      "AI-generated information for educational purposes only. Always consult your doctor before taking any medicine.";

    await supabase
      .from("prescriptions")
      .update({
        status: "ready",
        analysis,
        doctor_name: analysis.doctor_name ?? row.doctor_name,
        clinic_name: analysis.clinic_name ?? row.clinic_name,
      })
      .eq("id", row.id);

    await supabase.from("health_events").insert({
      user_id: userId,
      event_type: "prescription",
      title: analysis.doctor_name
        ? `Prescription from Dr. ${analysis.doctor_name}`
        : "New prescription analyzed",
      description: analysis.summary?.slice(0, 240) ?? null,
      ref_table: "prescriptions",
      ref_id: row.id,
    });

    return { ok: true, analysis };
  });

/* -------- Lab report analysis -------- */
export const analyzeLabReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ reportId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const { supabase, userId } = context;

    const { data: row, error } = await supabase
      .from("lab_reports")
      .select("*")
      .eq("id", data.reportId)
      .eq("user_id", userId)
      .single();
    if (error || !row) throw new Error("Report not found");

    const { dataUrl, bytes, mime } = await fetchFileAsDataUrl(supabase, "lab-reports", row.file_path);
    const isImage = mime.startsWith("image/");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway(MODEL),
      messages: [
        {
          role: "system",
          content:
            "You are a friendly medical assistant helping Indian patients understand their lab reports. Reply with ONLY valid JSON, no prose.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this lab report. Return JSON: { "lab_name": string|null, "report_type": string|null, "summary": string (3-4 plain-English sentences), "abnormal_values": [ { "test": string, "value": string, "reference_range": string, "meaning": string (plain English, 1-2 sentences) } ], "normal_values": [ { "test": string, "value": string } ], "questions_for_doctor": string[] (3-5 concise questions) }. Do not diagnose. Never recommend medication.`,
            },
            isImage
              ? { type: "image" as const, image: dataUrl }
              : { type: "file" as const, data: bytes, mediaType: mime },
          ],
        },
      ],
    });

    let analysis: any;
    try {
      analysis = extractJson(text);
    } catch {
      analysis = { summary: text, abnormal_values: [], normal_values: [], questions_for_doctor: [] };
    }
    analysis.disclaimer =
      "AI-generated information for educational purposes only. This is not a diagnosis. Please review with your doctor.";

    await supabase
      .from("lab_reports")
      .update({
        status: "ready",
        analysis,
        lab_name: analysis.lab_name ?? row.lab_name,
        report_type: analysis.report_type ?? row.report_type,
      })
      .eq("id", row.id);

    await supabase.from("health_events").insert({
      user_id: userId,
      event_type: "lab_report",
      title: analysis.report_type ? `${analysis.report_type} report` : "New lab report analyzed",
      description: analysis.summary?.slice(0, 240) ?? null,
      ref_table: "lab_reports",
      ref_id: row.id,
    });

    return { ok: true, analysis };
  });

/* -------- Dashboard AI insights (lightweight) -------- */
export const generateHealthInsights = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { insights: [] };
    const { supabase, userId } = context;

    const [{ data: prescriptions }, { data: reports }, { data: reminders }] = await Promise.all([
      supabase.from("prescriptions").select("analysis, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(3),
      supabase.from("lab_reports").select("analysis, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(3),
      supabase.from("medicine_reminders").select("medicine_name, frequency, active").eq("user_id", userId).eq("active", true).limit(10),
    ]);

    const context_str = JSON.stringify({ prescriptions, reports, reminders }).slice(0, 6000);
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { text } = await generateText({
        model: gateway(MODEL),
        messages: [
          { role: "system", content: "You give short, positive, non-diagnostic health nudges. Reply with ONLY a JSON array of 3 strings, each ≤ 20 words." },
          { role: "user", content: `Patient snapshot: ${context_str}\n\nGive 3 friendly, actionable insights.` },
        ],
      });
      const arr = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? "[]");
      return { insights: Array.isArray(arr) ? arr.slice(0, 3) : [] };
    } catch {
      return { insights: [] };
    }
  });

/* -------- AI Health Assistant chat -------- */
export const askHealthAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        messages: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
          .min(1)
          .max(30),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway(MODEL),
      messages: [
        {
          role: "system",
          content:
            "You are MEDOOGLE AI Copilot for Indian patients. Give short, warm, plain-English guidance about medicines, symptoms, lab reports and general wellness. Never diagnose. Always recommend consulting a doctor for anything serious. Prefer bullet points. Keep answers under 180 words.",
        },
        ...data.messages,
      ],
    });
    return { reply: text };
  });