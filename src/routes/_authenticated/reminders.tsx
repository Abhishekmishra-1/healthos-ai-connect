import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pill, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/reminders")({
  head: () => ({ meta: [{ title: "Medicine Reminders — HealthOS AI" }] }),
  component: Reminders,
});

function Reminders() {
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      const { data } = await supabase.from("medicine_reminders").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ medicine_name: "", dosage: "", frequency: "twice daily", times: "08:00,20:00", food_timing: "after food" });

  async function save() {
    if (!form.medicine_name) return toast.error("Medicine name required");
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) throw new Error("Not signed in");
      const times = form.times.split(",").map((t) => t.trim()).filter(Boolean);
      const { error } = await supabase.from("medicine_reminders").insert({
        user_id: uid, medicine_name: form.medicine_name, dosage: form.dosage, frequency: form.frequency,
        times, food_timing: form.food_timing, active: true,
      });
      if (error) throw error;
      toast.success("Reminder added");
      setOpen(false);
      setForm({ medicine_name: "", dosage: "", frequency: "twice daily", times: "08:00,20:00", food_timing: "after food" });
      qc.invalidateQueries({ queryKey: ["reminders"] });
      qc.invalidateQueries({ queryKey: ["dash"] });
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  }

  async function toggle(id: string, active: boolean) {
    await supabase.from("medicine_reminders").update({ active: !active }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["reminders"] });
  }
  async function del(id: string) {
    await supabase.from("medicine_reminders").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["reminders"] });
    qc.invalidateQueries({ queryKey: ["dash"] });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Medicine Reminders</h1>
          <p className="mt-2 text-sm text-muted-foreground">Never miss a dose. Set schedules and food timings.</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-glow">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-6 shadow-glow" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">New reminder</h2>
            <div className="mt-4 space-y-3">
              <Field label="Medicine name" value={form.medicine_name} onChange={(v) => setForm({ ...form, medicine_name: v })} />
              <Field label="Dosage (e.g. 500 mg, 1 tablet)" value={form.dosage} onChange={(v) => setForm({ ...form, dosage: v })} />
              <Field label="Frequency" value={form.frequency} onChange={(v) => setForm({ ...form, frequency: v })} />
              <Field label="Times (comma separated, 24h)" value={form.times} onChange={(v) => setForm({ ...form, times: v })} />
              <div>
                <label className="text-xs font-medium text-muted-foreground">Food timing</label>
                <select value={form.food_timing} onChange={(e) => setForm({ ...form, food_timing: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm">
                  <option>before food</option><option>after food</option><option>with food</option><option>anytime</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-full px-4 py-2 text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full gradient-brand px-4 py-2 text-sm font-semibold text-white">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {list.data?.map((m: any) => (
          <div key={m.id} className={`rounded-3xl border border-border/60 bg-card p-5 ${!m.active ? "opacity-50" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl gradient-brand text-white"><Pill className="h-4 w-4" /></span>
                <div>
                  <p className="font-semibold">{m.medicine_name}</p>
                  <p className="text-xs text-muted-foreground">{m.dosage} · {m.frequency}</p>
                </div>
              </div>
              <button onClick={() => del(m.id)} className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-red-500/10 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {m.times?.map((t: string) => <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-xs">{t}</span>)}
              {m.food_timing && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs gradient-brand-text">{m.food_timing}</span>}
            </div>
            <button onClick={() => toggle(m.id, m.active)} className="mt-3 text-xs font-medium text-muted-foreground hover:text-foreground">
              {m.active ? "Pause" : "Resume"}
            </button>
          </div>
        ))}
        {list.data?.length === 0 && <p className="text-sm text-muted-foreground">No reminders yet. Tap Add to create one.</p>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
    </div>
  );
}