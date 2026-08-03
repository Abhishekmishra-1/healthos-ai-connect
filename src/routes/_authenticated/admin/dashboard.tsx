import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stethoscope, Pill, FlaskConical, Hospital, Building2, TestTube2, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin — MEDOOGLE AI" }] }),
  component: AdminDashboard,
});

const CARDS = [
  { to: "/admin/users", label: "Users", table: "profiles", icon: Users, tint: "from-teal-100 to-white" },
  { to: "/admin/doctors", label: "Doctors", table: "catalog_doctors", icon: Stethoscope, tint: "from-sky-100 to-white" },
  { to: "/admin/pharmacies", label: "Pharmacies", table: "catalog_pharmacies", icon: Pill, tint: "from-emerald-100 to-white" },
  { to: "/admin/labs", label: "Labs", table: "catalog_labs", icon: FlaskConical, tint: "from-fuchsia-100 to-white" },
  { to: "/admin/hospitals", label: "Hospitals", table: "catalog_hospitals", icon: Hospital, tint: "from-indigo-100 to-white" },
  { to: "/admin/medicines", label: "Medicines", table: "catalog_medicines", icon: Building2, tint: "from-amber-100 to-white" },
  { to: "/admin/tests", label: "Lab Tests", table: "catalog_tests", icon: TestTube2, tint: "from-rose-100 to-white" },
] as const;

function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    (async () => {
      const entries = await Promise.all(
        CARDS.map(async (c) => {
          const { count } = await (supabase.from(c.table as any) as any).select("*", { count: "exact", head: true });
          return [c.table, count ?? 0] as const;
        }),
      );
      setCounts(Object.fromEntries(entries));
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Admin Panel</h1>
        <p className="mt-1 text-base text-muted-foreground">Manage the MEDOOGLE catalog — providers, medicines and tests.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className={`group flex items-center gap-5 rounded-3xl border border-border/60 bg-gradient-to-br ${c.tint} p-6 transition hover:-translate-y-0.5 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary`}>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-primary shadow-sm">
              <c.icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-xl font-semibold tracking-tight">{c.label}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{counts[c.table] ?? "—"} records</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}