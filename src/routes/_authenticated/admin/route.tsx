import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Stethoscope, Pill, FlaskConical, Hospital, Building2, TestTube2 } from "lucide-react";
import { RoleShell, type NavItem } from "@/components/site/role-shell";

const nav: NavItem[] = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/admin/pharmacies", label: "Pharmacies", icon: Pill },
  { to: "/admin/labs", label: "Labs", icon: FlaskConical },
  { to: "/admin/hospitals", label: "Hospitals", icon: Hospital },
  { to: "/admin/medicines", label: "Medicines", icon: Building2 },
  { to: "/admin/tests", label: "Lab Tests", icon: TestTube2 },
];

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ location }) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth", search: { redirect: location.href } });
    let { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!data) {
      // First visit after sign-up: create the profile + default patient role, then re-check.
      const { data: bootstrapped } = await supabase.rpc("bootstrap_current_user");
      if (bootstrapped === "admin") data = true;
    }
    if (!data) throw redirect({ to: "/dashboard" });
  },
  component: () => (
    <RoleShell roleLabel="Admin" sideNav={nav} bottomNav={nav.slice(0, 5)} profileTo="/admin/dashboard" />
  ),
});