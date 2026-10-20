import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save, Send, Upload, FileCheck2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export type ProviderField = {
  key: string;
  label: string;
  type?: "text" | "number" | "boolean" | "textarea" | "file";
  required?: boolean;
  placeholder?: string;
};
export type ProviderSection = { title: string; fields: ProviderField[] };

type Table = "provider_doctor_profiles" | "provider_lab_profiles";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  incomplete: "Incomplete",
  pending_verification: "Awaiting verification",
  approved: "Approved & listed",
  rejected: "Needs correction",
};

const MAX_FILE = 5 * 1024 * 1024;
const ALLOWED = ["application/pdf", "image/png", "image/jpeg"];

export function useOwnProviderProfile(table: Table) {
  return useQuery({
    queryKey: ["provider-profile", table],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { data, error } = await supabase.from(table).select("*").eq("owner_user_id", u.user.id).maybeSingle();
      if (error) throw error;
      return { userId: u.user.id, row: data as Record<string, unknown> | null };
    },
  });
}

export function ProviderProfileForm({ table, sections, title }: { table: Table; sections: ProviderSection[]; title: string }) {
  const qc = useQueryClient();
  const q = useOwnProviderProfile(table);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const row = q.data?.row;
  const status = (row?.["status"] as string) ?? "draft";
  const allFields = useMemo(() => sections.flatMap((s) => s.fields), [sections]);

  useEffect(() => {
    if (row) setForm(row);
  }, [row]);

  const required = allFields.filter((f) => f.required);
  const filled = required.filter((f) => String(form[f.key] ?? "").trim() !== "").length;
  const pct = required.length ? Math.round((filled / required.length) * 100) : 100;

  function payload() {
    const p: Record<string, unknown> = {};
    for (const f of allFields) {
      if (f.type === "file") continue;
      const v = form[f.key];
      if (f.type === "number") p[f.key] = v === "" || v == null ? null : Number(v);
      else if (f.type === "boolean") p[f.key] = Boolean(v);
      else p[f.key] = v == null ? null : String(v);
    }
    if (p["experience_years"] === null) p["experience_years"] = 0;
    return p;
  }

  async function save(nextStatus?: string) {
    if (!q.data) return;
    setBusy(nextStatus ? "submit" : "save");
    const base = payload();
    let error;
    if (!row) {
      ({ error } = await supabase.from(table).insert({ ...base, owner_user_id: q.data.userId, status: "draft" } as never));
      if (!error && nextStatus) ({ error } = await supabase.from(table).update({ status: nextStatus, submitted_at: new Date().toISOString() } as never).eq("owner_user_id", q.data.userId));
    } else {
      const s = nextStatus ?? (status === "approved" || status === "rejected" ? "draft" : status);
      ({ error } = await supabase.from(table).update({ ...base, status: s, ...(nextStatus ? { submitted_at: new Date().toISOString() } : {}) } as never).eq("owner_user_id", q.data.userId));
    }
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(nextStatus ? "Submitted for verification" : "Saved");
    qc.invalidateQueries({ queryKey: ["provider-profile", table] });
  }

  async function upload(key: string, file: File) {
    if (!q.data) return;
    if (!ALLOWED.includes(file.type)) return toast.error("Only PDF, PNG or JPG files are allowed");
    if (file.size > MAX_FILE) return toast.error("File must be under 5 MB");
    if (!row) return toast.error("Save your profile once before uploading documents");
    setBusy(key);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
    const path = `${q.data.userId}/${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("provider-verification-documents").upload(path, file);
    if (!error) {
      const { error: e2 } = await supabase.from(table).update({ [key]: path } as never).eq("owner_user_id", q.data.userId);
      if (e2) toast.error(e2.message);
      else toast.success("Document uploaded");
    } else toast.error(error.message);
    setBusy(null);
    qc.invalidateQueries({ queryKey: ["provider-profile", table] });
  }

  if (q.isLoading) return <div className="grid place-items-center p-16 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (q.error) return <p className="p-6 text-sm text-destructive">{(q.error as Error).message}</p>;

  const locked = status === "pending_verification";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Only approved profiles are shown to patients. Documents stay private to you and our verification team.</p>
        </div>
        <span className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold">{STATUS_LABEL[status] ?? status}</span>
      </div>

      {status === "rejected" && row?.["rejection_reason"] ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="font-semibold">Correction requested</p>
          <p className="mt-1">{String(row["rejection_reason"])}</p>
        </div>
      ) : null}
      {status === "approved" && <p className="rounded-2xl bg-secondary/60 p-4 text-sm">Your profile is live. Editing it will hide your listing until it is re-approved.</p>}
      {locked && <p className="rounded-2xl bg-secondary/60 p-4 text-sm">Your profile is under review. You can edit again after the decision.</p>}

      <div className="rounded-3xl border border-border/60 bg-card p-5">
        <div className="flex justify-between text-sm font-medium"><span>Profile completion</span><span>{pct}%</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full gradient-brand" style={{ width: `${pct}%` }} /></div>
      </div>

      {sections.map((s) => (
        <section key={s.title} className="rounded-3xl border border-border/60 bg-card p-6">
          <h2 className="text-lg font-semibold">{s.title}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {s.fields.map((f) => (
              <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                <label className="text-xs font-medium text-muted-foreground">{f.label}{f.required && " *"}</label>
                {f.type === "boolean" ? (
                  <label className="mt-2 flex items-center gap-2 text-sm">
                    <input type="checkbox" disabled={locked} checked={Boolean(form[f.key])} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} /> Yes
                  </label>
                ) : f.type === "textarea" ? (
                  <textarea disabled={locked} rows={3} value={String(form[f.key] ?? "")} placeholder={f.placeholder} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
                ) : f.type === "file" ? (
                  <div className="mt-1 flex items-center gap-3">
                    <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold ${locked ? "pointer-events-none opacity-50" : ""}`}>
                      {busy === f.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
                      <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={(e) => e.target.files?.[0] && upload(f.key, e.target.files[0])} />
                    </label>
                    {form[f.key] ? <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><FileCheck2 className="h-4 w-4" /> Uploaded</span> : <span className="text-xs text-muted-foreground">PDF/JPG/PNG, max 5 MB</span>}
                  </div>
                ) : (
                  <input disabled={locked} type={f.type === "number" ? "number" : "text"} min={0} value={String(form[f.key] ?? "")} placeholder={f.placeholder} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {!locked && (
        <div className="flex flex-wrap gap-3">
          <button onClick={() => save()} disabled={!!busy} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold disabled:opacity-60">
            {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save draft
          </button>
          <button onClick={() => save("pending_verification")} disabled={!!busy || pct < 100} className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50">
            {busy === "submit" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit for verification
          </button>
        </div>
      )}
    </div>
  );
}
