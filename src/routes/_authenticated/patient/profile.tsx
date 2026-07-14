import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/patient/profile")({
  head: () => ({ meta: [{ title: "Profile — MEDOOGLE AI" }] }),
  component: Profile,
});

const fields: { key: string; label: string; type?: string; placeholder?: string }[] = [
  { key: "full_name", label: "Full name" },
  { key: "phone", label: "Phone" },
  { key: "date_of_birth", label: "Date of birth", type: "date" },
  { key: "blood_group", label: "Blood group", placeholder: "O+, A-, B+ …" },
  { key: "allergies", label: "Allergies (comma separated)" },
  { key: "emergency_contact_name", label: "Emergency contact name" },
  { key: "emergency_contact_phone", label: "Emergency contact phone" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
];

function Profile() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return { user: u.user, profile: data };
    },
  });

  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (q.data?.profile) {
      const p: any = q.data.profile;
      const next: Record<string, string> = {};
      fields.forEach((f) => (next[f.key] = p[f.key] ?? ""));
      setForm(next);
    }
  }, [q.data]);

  async function save() {
    if (!q.data?.user) return;
    setSaving(true);
    try {
      const payload: any = { id: q.data.user.id, ...form, updated_at: new Date().toISOString() };
      if (!payload.date_of_birth) payload.date_of_birth = null;
      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;
      toast.success("Profile saved");
      qc.invalidateQueries({ queryKey: ["profile"] });
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Your Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">{q.data?.user?.email}</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-border/60 bg-card p-6 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className={f.key === "allergies" ? "md:col-span-2" : ""}>
            <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
            <input type={f.type ?? "text"} value={form[f.key] ?? ""} placeholder={f.placeholder}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-2.5 text-sm font-semibold text-white shadow-glow disabled:opacity-60">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
      </button>
    </div>
  );
}