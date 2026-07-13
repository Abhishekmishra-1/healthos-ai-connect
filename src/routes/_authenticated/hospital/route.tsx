import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Stethoscope, Users, BedDouble, Siren, Receipt, BarChart3, LayoutDashboard } from "lucide-react";
import { RoleShell, type NavItem } from "@/components/site/role-shell";
const nav: NavItem[] = [
  { to: "/hospital/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/hospital/departments", label: "Departments", icon: Building2 },
  { to: "/hospital/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/hospital/patients", label: "Patients", icon: Users },
  { to: "/hospital/admissions", label: "Admissions", icon: BedDouble },
  { to: "/hospital/emergency", label: "Emergency", icon: Siren },
  { to: "/hospital/billing", label: "Billing", icon: Receipt },
  { to: "/hospital/analytics", label: "Analytics", icon: BarChart3 },
];
export const Route = createFileRoute("/_authenticated/hospital")({
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "hospital" });
    if (!data) throw redirect({ to: "/dashboard" });
  },
  component: () => <RoleShell roleLabel="Hospital" sideNav={nav} bottomNav={nav.slice(0,5)} profileTo="/hospital/dashboard" />,
});
