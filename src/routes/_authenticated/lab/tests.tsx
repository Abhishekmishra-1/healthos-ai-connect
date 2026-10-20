import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOwnProviderProfile } from "@/components/provider/provider-profile-form";

export const Route = createFileRoute("/_authenticated/lab/tests")({
  head: () => ({ meta: [{ title: "My tests — MEDOOGLE AI Lab" }] }),
  component: LabTests,
});

type Test = { id: string; name: string; category: string | null; price: number; discounted_price: number | null; sample_type: string | null; turnaround_time: string | null; home_collection: boolean; active: boolean };
const empty = { name: "", category: "", price: "", discounted_price: "", sample_type: "", turnaround_time: "", home_collection: false };

function LabTests() {
  const qc = useQueryClient();
  const profile = useOwnProviderProfile("provider_lab_profiles");
  const labId = profile.data?.row?.["id"] as string | undefined;
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<typeof empty & { id?: string }>(empty);
  const [saving, setSaving] = useState(false);

  const tests = useQuery({
    queryKey: ["lab-tests", labId],
    enabled: !!labId,
    queryFn: async () => {
      const { data, error } = await supabase.from("provider_lab_tests").select("*").eq("lab_id", labId!).order("name");
      if (error) throw error;
      return data as Test[];
    },
  });

  async function save() {
    if (!form.name.trim() || form.price === "") return toast.error("Name and price are required");
    setSaving(true);
    const p = { lab_id: labId!, name: form.name.trim(), category: form.category || null, price: Number(form.price), discounted_price: form.discounted_price === "" ? null : Number(form.discounted_price), sample_type: form.sample_type || null, turnaround_time: form.turnaround_time || null, home_collection: form.home_collection };
    const { error } = form.id ? await supabase.from("provider_lab_tests").update(p).eq("id", form.id) : await supabase.from("provider_lab_tests").insert(p);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Test updated" : "Test added");
    setForm(empty);
    qc.invalidateQueries({ queryKey: ["lab-tests", labId] });
  }

  async function toggle(t: Test) {
    const { error } = await supabase.from("provider_lab_tests").update({ active: !t.active }).eq("id", t.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["lab-tests", labId] });
  }

  if (profile.isLoading) return <div className="grid place-items-center p-16"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!labId) return (
    <div className="rounded-3xl border border-border/60 bg-card p-8 text-center">
      <p className="font-semibold">Set up your laboratory profile first</p>
      <Link to="/lab/profile" className="mt-4 inline-block rounded-full gradient-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground">Go to profile</Link>
    </div>
  );

  const list = (tests.data ?? []).filter((t) => `${t.name} ${t.category ?? ""}`.toLowerCase().includes(search.toLowerCase()));
  const input = "w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">My tests</h1>
        <p className="mt-1 text-sm text-muted-foreground">Active tests appear to patients once your laboratory is approved.</p>
      </div>
      <section className="rounded-3xl border border-border/60 bg-card p-6">
        <h2 className="text-lg font-semibold">{form.id ? "Edit test" : "Add a test"}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input className={input} placeholder="Test name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={input} placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className={input} type="number" min={0} placeholder="Price ₹ *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className={input} type="number" min={0} placeholder="Offer price ₹" value={form.discounted_price} onChange={(e) => setForm({ ...form, discounted_price: e.target.value })} />
          <input className={input} placeholder="Sample type (Blood, Urine)" value={form.sample_type} onChange={(e) => setForm({ ...form, sample_type: e.target.value })} />
          <input className={input} placeholder="Report time (24 hrs)" value={form.turnaround_time} onChange={(e) => setForm({ ...form, turnaround_time: e.target.value })} />
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={form.home_collection} onChange={(e) => setForm({ ...form, home_collection: e.target.checked })} /> Home collection available</label>
        <div className="mt-4 flex gap-2">
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {form.id ? "Update" : "Add test"}
          </button>
          {form.id && <button onClick={() => setForm(empty)} className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold">Cancel</button>}
        </div>
      </section>
      <section className="rounded-3xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-2 rounded-2xl border border-border px-4"><Search className="h-4 w-4 text-muted-foreground" /><input className="w-full bg-transparent py-2.5 text-sm outline-none" placeholder="Search tests" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="mt-4 space-y-2">
          {tests.isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          {!tests.isLoading && list.length === 0 && <p className="text-sm text-muted-foreground">No tests yet.</p>}
          {list.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-secondary/50 px-4 py-3 text-sm">
              <div>
                <p className="font-semibold">{t.name} {!t.active && <span className="text-xs text-muted-foreground">(hidden)</span>}</p>
                <p className="text-xs text-muted-foreground">{t.category ?? "General"} · ₹{t.discounted_price ?? t.price}{t.discounted_price != null && <s className="ml-1">₹{t.price}</s>}{t.home_collection ? " · Home collection" : ""}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setForm({ id: t.id, name: t.name, category: t.category ?? "", price: String(t.price), discounted_price: t.discounted_price == null ? "" : String(t.discounted_price), sample_type: t.sample_type ?? "", turnaround_time: t.turnaround_time ?? "", home_collection: t.home_collection })} className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold">Edit</button>
                <button onClick={() => toggle(t)} className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold">{t.active ? "Hide" : "Show"}</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
