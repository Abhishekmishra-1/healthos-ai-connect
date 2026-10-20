import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/verifications")({
  head: () => ({ meta: [{ title: "Provider verification — MEDOOGLE AI Admin" }] }),
  component: Verifications,
});

type Item = { kind: "doctor" | "lab"; id: string; name: string; meta: string; status: string; reg: string; authority: string; docs: string[]; reason: string | null };

function Verifications() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "verifications"],
    queryFn: async () => {
      const [d, l] = await Promise.all([
        supabase.from("provider_doctor_profiles").select("*").order("submitted_at", { ascending: false }),
        supabase.from("provider_lab_profiles").select("*").order("submitted_at", { ascending: false }),
      ]);
      if (d.error) throw d.error;
      if (l.error) throw l.error;
      const items: Item[] = [
        ...(d.data ?? []).map((p) => ({ kind: "doctor" as const, id: p.id, name: p.full_name || "Unnamed doctor", meta: [p.specialty, p.qualifications, p.city].filter(Boolean).join(" · "), status: p.status, reg: p.registration_number ?? "", authority: p.issuing_authority ?? "", docs: [p.certificate_path].filter(Boolean) as string[], reason: p.rejection_reason })),
        ...(l.data ?? []).map((p) => ({ kind: "lab" as const, id: p.id, name: p.lab_name || "Unnamed laboratory", meta: [p.lab_type, p.city, p.business_phone].filter(Boolean).join(" · "), status: p.status, reg: p.registration_number ?? "", authority: p.issuing_authority ?? "", docs: [p.certificate_path, p.accreditation_certificate_path].filter(Boolean) as string[], reason: p.rejection_reason })),
      ];
      return items;
    },
  });

  async function openDoc(path: string) {
    const { data, error } = await supabase.storage.from("provider-verification-documents").createSignedUrl(path, 120);
    if (error) return toast.error(error.message);
    window.open(data.signedUrl, "_blank", "noopener");
  }

  async function review(it: Item, decision: "approve" | "reject") {
    let reason: string | null = null;
    if (decision === "reject") {
      reason = window.prompt("What needs to be corrected?");
      if (!reason?.trim()) return;
    }
    const fn = it.kind === "doctor" ? "review_doctor_application" : "review_lab_application";
    const { error } = await supabase.rpc(fn, { p_profile_id: it.id, p_decision: decision, p_reason: reason ?? undefined });
    if (error) return toast.error(error.message);
    toast.success(decision === "approve" ? "Approved and listed" : "Correction requested");
    qc.invalidateQueries({ queryKey: ["admin", "verifications"] });
  }

  if (q.isLoading) return <div className="grid place-items-center p-16"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (q.error) return <p className="text-sm text-destructive">{(q.error as Error).message}</p>;
  const items = q.data ?? [];
  const groups = [
    { title: "Awaiting verification", list: items.filter((i) => i.status === "pending_verification") },
    { title: "Approved", list: items.filter((i) => i.status === "approved") },
    { title: "Drafts & corrections", list: items.filter((i) => !["pending_verification", "approved"].includes(i.status)) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Provider verification</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review doctor and laboratory applications. Approving lists them for patients; rejecting hides them.</p>
      </div>
      {groups.map((g) => (
        <section key={g.title} className="rounded-3xl border border-border/60 bg-card p-6">
          <h2 className="text-lg font-semibold">{g.title} ({g.list.length})</h2>
          <div className="mt-3 space-y-2">
            {g.list.length === 0 && <p className="text-sm text-muted-foreground">Nothing here.</p>}
            {g.list.map((it) => (
              <div key={it.id} className="rounded-2xl bg-secondary/50 p-4 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold"><span className="mr-2 rounded-full bg-card px-2 py-0.5 text-xs capitalize">{it.kind}</span>{it.name}</p>
                    <p className="text-xs text-muted-foreground">{it.meta}</p>
                    <p className="mt-1 text-xs">Reg: {it.reg || "—"} · {it.authority || "—"}</p>
                    {it.reason && <p className="mt-1 text-xs text-destructive">Reason: {it.reason}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {it.docs.map((d, i) => (
                      <button key={d} onClick={() => openDoc(d)} className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold"><FileText className="h-3.5 w-3.5" /> Document {i + 1}</button>
                    ))}
                    {it.status === "pending_verification" && <button onClick={() => review(it, "approve")} className="rounded-full gradient-brand px-4 py-1.5 text-xs font-semibold text-primary-foreground">Approve</button>}
                    {(it.status === "pending_verification" || it.status === "approved") && <button onClick={() => review(it, "reject")} className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold">{it.status === "approved" ? "Delist" : "Request correction"}</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
