import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users/$userId")({
  head: () => ({ meta: [{ title: "Manage user — MEDOOGLE AI Admin" }] }),
  component: ManageUser,
});

const ROLES = [
  "patient",
  "doctor",
  "nurse",
  "staff",
  "receptionist",
  "pharmacy",
  "lab",
  "hospital",
  "admin",
  "superadmin",
] as const;
type Role = (typeof ROLES)[number];

const FIELDS: { key: string; label: string; type?: string }[] = [
  { key: "full_name", label: "Full name" },
  { key: "phone", label: "Phone" },
  { key: "date_of_birth", label: "Date of birth", type: "date" },
  { key: "blood_group", label: "Blood group" },
  { key: "allergies", label: "Allergies" },
  { key: "emergency_contact_name", label: "Emergency contact name" },
  { key: "emergency_contact_phone", label: "Emergency contact phone" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "pincode", label: "PIN code" },
];

function ManageUser() {
  const { userId } = Route.useParams();
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const me = useQuery({
    queryKey: ["admin", "me", "superadmin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data } = await supabase.rpc("has_role", {
        _user_id: u.user.id,
        _role: "superadmin" as never,
      });
      return Boolean(data);
    },
  });
  const isSuperadmin = me.data === true;

  const q = useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: async () => {
      const [profile, roles, appointments, prescriptions, reports, reminders, events, requests] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
          supabase.from("user_roles").select("id, role").eq("user_id", userId),
          supabase.from("appointments").select("*").eq("patient_id", userId).order("slot_date", { ascending: false }),
          supabase.from("prescriptions").select("id, file_name, status, doctor_name, created_at").eq("user_id", userId).order("created_at", { ascending: false }),
          supabase.from("lab_reports").select("id, file_name, status, report_type, created_at").eq("user_id", userId).order("created_at", { ascending: false }),
          supabase.from("medicine_reminders").select("id, medicine_name, dosage, frequency, active").eq("user_id", userId),
          supabase.from("health_events").select("id, title, event_type, occurred_at").eq("user_id", userId).order("occurred_at", { ascending: false }).limit(20),
          supabase.from("role_requests").select("id, requested_role, status, created_at").eq("user_id", userId),
        ]);
      return {
        profile: profile.data,
        roles: roles.data ?? [],
        appointments: appointments.data ?? [],
        prescriptions: prescriptions.data ?? [],
        reports: reports.data ?? [],
        reminders: reminders.data ?? [],
        events: events.data ?? [],
        requests: requests.data ?? [],
      };
    },
  });

  useEffect(() => {
    const p = q.data?.profile as Record<string, unknown> | null | undefined;
    if (!p) return;
    const next: Record<string, string> = {};
    FIELDS.forEach((f) => (next[f.key] = (p[f.key] as string) ?? ""));
    setForm(next);
  }, [q.data]);

  async function saveProfile() {
    setSaving(true);
    const payload: Record<string, unknown> = { id: userId, ...form, updated_at: new Date().toISOString() };
    if (!payload["date_of_birth"]) payload["date_of_birth"] = null;
    const { error } = await supabase.from("profiles").upsert(payload as never);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("User profile updated");
    qc.invalidateQueries({ queryKey: ["admin", "user", userId] });
  }

  async function toggleRole(role: Role, has: boolean) {
    const { error } = has
      ? await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role)
      : await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success(has ? `Removed ${role}` : `Granted ${role}`);
    qc.invalidateQueries({ queryKey: ["admin", "user", userId] });
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  async function reviewRequest(id: string, status: "approved" | "rejected", role: Role) {
    const { error } = await supabase
      .from("role_requests")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    if (status === "approved") await toggleRole(role, false);
    toast.success(`Request ${status}`);
    qc.invalidateQueries({ queryKey: ["admin", "user", userId] });
  }

  async function cancelAppointment(id: string) {
    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Appointment cancelled");
    qc.invalidateQueries({ queryKey: ["admin", "user", userId] });
  }

  if (q.isLoading) {
    return <div className="grid place-items-center p-16 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  const roles = q.data?.roles ?? [];

  return (
    <div className="space-y-6">
      <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All users
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {form["full_name"] || "Unnamed user"}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">{userId}</p>
      </div>

      {/* Roles */}
      <section className="rounded-3xl border border-border/60 bg-card p-6">
        <h2 className="text-lg font-semibold">Groups &amp; access</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isSuperadmin
            ? "Tap a group to grant or remove it for this user."
            : "Only the superadmin (app owner) can change a user's groups. Admins can manage doctor and other catalog details."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ROLES.map((r) => {
            const has = roles.some((x) => x.role === r);
            return (
              <button
                key={r}
                type="button"
                onClick={() => toggleRole(r, has)}
                disabled={!isSuperadmin}
                aria-pressed={has}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize disabled:cursor-not-allowed disabled:opacity-50 ${
                  has ? "gradient-brand text-white shadow-glow" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
        {isSuperadmin && (q.data?.requests ?? []).filter((r) => r.status === "pending").length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold">Pending group requests</p>
            {(q.data?.requests ?? [])
              .filter((r) => r.status === "pending")
              .map((r) => (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-secondary/60 px-4 py-3 text-sm">
                  <span className="font-medium capitalize">{r.requested_role}</span>
                  <div className="flex gap-2">
                    <button onClick={() => reviewRequest(r.id, "approved", r.requested_role as Role)} className="rounded-full gradient-brand px-4 py-1.5 text-xs font-semibold text-white">Approve</button>
                    <button onClick={() => reviewRequest(r.id, "rejected", r.requested_role as Role)} className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold">Reject</button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Profile */}
      <section className="rounded-3xl border border-border/60 bg-card p-6">
        <h2 className="text-lg font-semibold">Profile details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
              <input
                type={f.type ?? "text"}
                value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>
        <button
          onClick={saveProfile}
          disabled={saving}
          className="mt-4 inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-2.5 text-sm font-semibold text-white shadow-glow disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
        </button>
      </section>

      {/* Appointments */}
      <section className="rounded-3xl border border-border/60 bg-card p-6">
        <h2 className="text-lg font-semibold">Appointments ({q.data?.appointments.length ?? 0})</h2>
        <div className="mt-3 space-y-2">
          {(q.data?.appointments ?? []).length === 0 && <p className="text-sm text-muted-foreground">No appointments.</p>}
          {(q.data?.appointments ?? []).map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-secondary/50 px-4 py-3 text-sm">
              <div>
                <p className="font-semibold">{a.doctor_name} · {a.slot_date} {a.slot_time}</p>
                <p className="text-xs text-muted-foreground capitalize">{a.mode} · ₹{a.fee} · {a.status}</p>
              </div>
              {a.status !== "cancelled" && (
                <button onClick={() => cancelAppointment(a.id)} className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-red-600">Cancel</button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Health data */}
      <div className="grid gap-4 md:grid-cols-2">
        <DataCard title={`Prescriptions (${q.data?.prescriptions.length ?? 0})`} rows={(q.data?.prescriptions ?? []).map((p) => `${p.file_name ?? "File"} · ${p.status}`)} />
        <DataCard title={`Lab reports (${q.data?.reports.length ?? 0})`} rows={(q.data?.reports ?? []).map((r) => `${r.report_type ?? r.file_name ?? "Report"} · ${r.status}`)} />
        <DataCard title={`Medicine reminders (${q.data?.reminders.length ?? 0})`} rows={(q.data?.reminders ?? []).map((r) => `${r.medicine_name}${r.dosage ? ` · ${r.dosage}` : ""}${r.active ? "" : " · inactive"}`)} />
        <DataCard title={`Health timeline (${q.data?.events.length ?? 0})`} rows={(q.data?.events ?? []).map((e) => `${e.title} · ${new Date(e.occurred_at).toLocaleDateString("en-IN")}`)} />
      </div>
    </div>
  );
}

function DataCard({ title, rows }: { title: string; rows: string[] }) {
  return (
    <section className="rounded-3xl border border-border/60 bg-card p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        {rows.length === 0 && <li>Nothing yet.</li>}
        {rows.map((r, i) => <li key={i} className="truncate">• {r}</li>)}
      </ul>
    </section>
  );
}