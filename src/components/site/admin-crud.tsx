import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Pencil, Trash2, Loader2, X, Save } from "lucide-react";
import { toast } from "sonner";

export type FieldType = "text" | "number" | "boolean";
export type Field = { key: string; label: string; type?: FieldType; placeholder?: string; required?: boolean };

export function AdminCrud({
  title,
  description,
  table,
  fields,
  searchKeys,
}: {
  title: string;
  description: string;
  table: string;
  fields: Field[];
  searchKeys: string[];
}) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await (supabase.from(table as any) as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as any[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [table]);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) => searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(needle)));
  }, [q, rows, searchKeys]);

  function openNew() {
    const blank: Record<string, any> = {};
    fields.forEach((f) => (blank[f.key] = f.type === "boolean" ? false : f.type === "number" ? 0 : ""));
    setEditing(blank);
    setOpen(true);
  }

  function openEdit(row: any) {
    setEditing({ ...row });
    setOpen(true);
  }

  async function save() {
    if (!editing) return;
    const payload: Record<string, any> = {};
    fields.forEach((f) => {
      let v = editing[f.key];
      if (f.type === "number") v = v === "" || v == null ? null : Number(v);
      payload[f.key] = v;
    });
    const isEdit = Boolean(editing.id);
    const q = isEdit
      ? (supabase.from(table as any) as any).update(payload).eq("id", editing.id)
      : (supabase.from(table as any) as any).insert(payload);
    const { error } = await q;
    if (error) return toast.error(error.message);
    toast.success(isEdit ? "Updated" : "Created");
    setOpen(false);
    setEditing(null);
    load();
  }

  async function remove(row: any) {
    if (!confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    const { error } = await (supabase.from(table as any) as any).delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Plus className="h-4 w-4" /> Add new
        </button>
      </div>

      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}…`}
          aria-label={`Search ${title}`}
          className="w-full rounded-2xl border border-border/60 bg-card py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              {fields.map((f) => (
                <th key={f.key} className="px-4 py-3 font-medium">{f.label}</th>
              ))}
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={fields.length + 1} className="px-4 py-8 text-center text-muted-foreground"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={fields.length + 1} className="px-4 py-8 text-center text-muted-foreground">No records yet — click "Add new" to create one.</td></tr>
            )}
            {!loading && filtered.map((row) => (
              <tr key={row.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/40">
                {fields.map((f) => (
                  <td key={f.key} className="px-4 py-3 align-top">
                    {f.type === "boolean" ? (row[f.key] ? "Yes" : "No") : String(row[f.key] ?? "—")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(row)} aria-label={`Edit ${row.name}`} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(row)} aria-label={`Delete ${row.name}`} className="grid h-9 w-9 place-items-center rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm md:items-center md:p-4" role="dialog" aria-modal="true" aria-label={`${editing.id ? "Edit" : "New"} ${title}`}>
          <div className="w-full max-w-lg rounded-t-3xl bg-card p-6 shadow-glow md:rounded-3xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing.id ? "Edit" : "New"} {title.replace(/s$/, "")}</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-3">
              {fields.map((f) => (
                <label key={f.key} className="block text-sm">
                  <span className="mb-1 block font-medium text-muted-foreground">{f.label}</span>
                  {f.type === "boolean" ? (
                    <div className="flex items-center gap-2">
                      <input
                        id={`admin-${f.key}`}
                        type="checkbox"
                        checked={Boolean(editing[f.key])}
                        onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })}
                        className="h-5 w-5 rounded border-border"
                      />
                      <span className="text-sm text-muted-foreground">Enabled</span>
                    </div>
                  ) : (
                    <input
                      required={f.required}
                      type={f.type === "number" ? "number" : "text"}
                      value={editing[f.key] ?? ""}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  )}
                </label>
              ))}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary">
                  Cancel
                </button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow">
                  <Save className="h-4 w-4" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}