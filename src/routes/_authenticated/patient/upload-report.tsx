import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { analyzeLabReport } from "@/lib/health-ai.functions";
import { FlaskConical, Upload, Loader2, AlertCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/patient/upload-report")({
  head: () => ({ meta: [{ title: "Upload Lab Report — HealthOS AI" }] }),
  component: UploadReport,
});

function UploadReport() {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const analyzeFn = useServerFn(analyzeLabReport);

  const list = useQuery({
    queryKey: ["lab_reports"],
    queryFn: async () => {
      const { data } = await supabase.from("lab_reports").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) throw new Error("Not signed in");
      const path = `${uid}/${crypto.randomUUID()}-${file.name}`;
      const up = await supabase.storage.from("lab-reports").upload(path, file, { contentType: file.type });
      if (up.error) throw up.error;
      const ins = await supabase.from("lab_reports").insert({
        user_id: uid, file_path: path, file_name: file.name, mime_type: file.type, status: "processing",
      }).select().single();
      if (ins.error) throw ins.error;
      qc.invalidateQueries({ queryKey: ["lab_reports"] });
      toast.success("Uploaded. AI is reading your report…");
      try {
        await analyzeFn({ data: { reportId: ins.data.id } });
        toast.success("Report analyzed");
      } catch (err: any) {
        toast.error(err.message ?? "AI analysis failed");
      }
      qc.invalidateQueries({ queryKey: ["lab_reports"] });
      qc.invalidateQueries({ queryKey: ["dash"] });
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Upload Lab Report</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          We'll summarize your report in plain English, flag abnormal values, and suggest questions to ask your doctor.
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-card px-8 py-16 text-center hover:border-primary/60">
        {uploading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <Upload className="h-8 w-8 text-muted-foreground" />}
        <span className="text-sm font-medium">{uploading ? "Uploading…" : "Tap to upload lab report (image or PDF)"}</span>
        <span className="text-xs text-muted-foreground">Max 10 MB · JPG, PNG, PDF</span>
        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your reports</h2>
        {list.data?.length ? list.data.map((r: any) => <ReportCard key={r.id} r={r} />) : (
          <p className="text-sm text-muted-foreground">No lab reports uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

function ReportCard({ r }: { r: any }) {
  const a = r.analysis;
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
          </div>
          <h3 className="mt-1 text-base font-semibold">{a?.report_type ?? r.file_name ?? "Lab report"}</h3>
          {a?.lab_name && <p className="text-sm text-muted-foreground">{a.lab_name}</p>}
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${r.status === "ready" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" : "bg-amber-500/15 text-amber-600 dark:text-amber-300"}`}>{r.status}</span>
      </div>

      {a?.summary && <p className="mt-4 text-sm">{a.summary}</p>}

      {a?.abnormal_values?.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-300">Values to review</p>
          <div className="mt-2 space-y-2">
            {a.abnormal_values.map((v: any, i: number) => (
              <div key={i} className="rounded-2xl bg-amber-500/10 p-3">
                <p className="text-sm font-medium">{v.test}: <span className="font-normal">{v.value}</span> <span className="text-xs text-muted-foreground">(ref: {v.reference_range})</span></p>
                <p className="mt-1 text-xs">{v.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {a?.questions_for_doctor?.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ask your doctor</p>
          <ul className="mt-2 space-y-1">
            {a.questions_for_doctor.map((q: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm"><HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {q}</li>
            ))}
          </ul>
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