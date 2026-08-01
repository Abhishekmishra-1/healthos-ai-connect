import { supabase } from "@/integrations/supabase/client";

export type BookableDoctor = {
  id?: string | null;
  name: string;
  spec: string;
  clinic?: string | null;
  fee: number;
};

export type AppointmentMode = "video" | "clinic" | "chat";

export const MODE_LABEL: Record<AppointmentMode, string> = {
  video: "Video consult",
  clinic: "In-clinic visit",
  chat: "Chat consult",
};

/** Slots every doctor offers. Booked / past slots are filtered at render time. */
export const SLOT_GROUPS: { label: string; slots: string[] }[] = [
  { label: "Morning", slots: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"] },
  { label: "Afternoon", slots: ["12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"] },
  { label: "Evening", slots: ["05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"] },
];

export const ALL_SLOTS = SLOT_GROUPS.flatMap((g) => g.slots);

/** Next `count` calendar days starting today, as YYYY-MM-DD. */
export function nextDays(count = 7): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = 0; i < count; i++) {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    out.push(
      `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`,
    );
  }
  return out;
}

export function todayISO() {
  return nextDays(1)[0]!;
}

export function formatDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y!, (m ?? 1) - 1, d!);
  if (iso === todayISO()) return "Today";
  if (iso === nextDays(2)[1]) return "Tomorrow";
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function formatWhen(iso: string, time: string) {
  return `${formatDay(iso)}, ${time}`;
}

/** Minutes since midnight for a "hh:mm AM" label. */
export function slotMinutes(time: string) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return 0;
  let hour = Number(match[1]) % 12;
  if (match[3]!.toUpperCase() === "PM") hour += 12;
  return hour * 60 + Number(match[2]);
}

/** A slot on today's date is unbookable once it is less than 30 min away. */
export function isSlotInPast(iso: string, time: string) {
  if (iso !== todayISO()) return false;
  const now = new Date();
  return slotMinutes(time) <= now.getHours() * 60 + now.getMinutes() + 30;
}

/** Slots this patient already holds with the given doctor on the given date. */
export async function fetchBookedSlots(doctorName: string, slotDate: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select("slot_time")
    .eq("doctor_name", doctorName)
    .eq("slot_date", slotDate)
    .neq("status", "cancelled");
  if (error) return [];
  return (data ?? []).map((r) => r.slot_time);
}