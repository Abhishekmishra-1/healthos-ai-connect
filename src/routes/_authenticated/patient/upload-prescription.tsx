import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { analyzePrescription } from "@/lib/health-ai.functions";
import { FileText, Upload, Loader2, AlertCircle, Pill } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/patient/upload-prescription")({
  head: () => ({ meta: [{ title: "Upload Prescription — MEDOOGLE AI" }] }),
  component: UploadPrescription,
});

function UploadPrescription() {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const analyzeFn = useServerFn(analyzePrescription);

  const list = useQuery({
    queryKey: ["prescriptions"],
    queryFn: async () => {
      const { data } = await supabase.from("prescriptions").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("Not signed in");
      const path = `${uid}/${crypto.randomUUID()}-${file.name}`;
      const up = await supabase.storage.from("prescriptions").upload(path, file, { contentType: file.type });
      if (up.error) throw up.error;
      const ins = await supabase.from("prescriptions").insert({
        user_id: uid, file_path: path, file_name: file.name, mime_type: file.type, status: "processing",
      }).select().single();
      if (ins.error) throw ins.error;
      qc.invalidateQueries({ queryKey: ["prescriptions"] });
      toast.success("Uploaded. AI is reading your prescription…");
      try {
        await analyzeFn({ data: { prescriptionId: ins.data.id } });
        toast.success("Prescription analyzed");
      } catch (err: any) {
        toast.error(err.message ?? "AI analysis failed");
      }
      qc.invalidateQueries({ queryKey: ["prescriptions"] });
      qc.invalidateQueries({ queryKey: ["dash"] });
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Header title="Upload Prescription" desc="Snap a photo or upload a PDF. Our AI extracts medicines, dosage, and side effects in plain English." />

      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-card px-8 py-16 text-center hover:border-primary/60">
        {uploading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <Upload className="h-8 w-8 text-muted-foreground" />}
        <span className="text-sm font-medium">{uploading ? "Uploading…" : "Tap to upload prescription (image or PDF)"}</span>
        <span className="text-xs text-muted-foreground">Max 10 MB · JPG, PNG, PDF</span>
        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your prescriptions</h2>
        {list.data?.length ? list.data.map((p: any) => <PrescriptionCard key={p.id} p={p} />) : (
          <p className="text-sm text-muted-foreground">No prescriptions uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

function PrescriptionCard({ p }: { p: any }) {
  const a = p.analysis;
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</span>
          </div>
          <h3 className="mt-1 text-base font-semibold">{a?.doctor_name ? `Dr. ${a.doctor_name}` : p.file_name ?? "Prescription"}</h3>
          {a?.clinic_name && <p className="text-sm text-muted-foreground">{a.clinic_name}</p>}
        </div>
        <StatusPill status={p.status} />
      </div>

      {a?.summary && <p className="mt-4 text-sm">{a.summary}</p>}

      {a?.medicines?.length > 0 && (
        <div className="mt-4 space-y-3">
          {a.medicines.map((m: any, i: number) => (
            <div key={i} className="rounded-2xl bg-secondary/50 p-4">
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4 gradient-brand-text" />
                <p className="font-semibold">{m.name}</p>
              </div>
              <p className="mt-1 text-sm"><span className="text-muted-foreground">Dosage:</span> {m.dosage} · {m.frequency}{m.duration ? ` · ${m.duration}` : ""}</p>
              {m.food_timing && <p className="text-sm"><span className="text-muted-foreground">Timing:</span> {m.food_timing}</p>}
              {m.purpose && <p className="mt-2 text-sm">{m.purpose}</p>}
              {m.side_effects?.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">Common side effects: {m.side_effects.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {a?.disclaimer && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {a.disclaimer}
        </p>
      )}
    </div>
  );
}

function Header({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    processing: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    ready: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    error: "bg-red-500/15 text-red-500",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${map[status] ?? "bg-secondary"}`}>{status}</span>;
}