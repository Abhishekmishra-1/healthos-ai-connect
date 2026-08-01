import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, CalendarCheck, TestTube, FileText, Wallet } from "lucide-react";
import { RoleShell, type NavItem } from "@/components/site/role-shell";
const nav: NavItem[] = [
  { to: "/lab/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/lab/bookings", label: "Test Bookings", icon: CalendarCheck },
  { to: "/lab/collection", label: "Sample Collection", icon: TestTube },
  { to: "/lab/reports", label: "Reports", icon: FileText },
  { to: "/lab/payments", label: "Payments", icon: Wallet },
];
export const Route = createFileRoute("/_authenticated/lab")({
  beforeLoad: async ({ location }) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth", search: { redirect: location.href } });
    const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "lab" });
    if (!data) throw redirect({ to: "/dashboard" });
  },
  component: () => <RoleShell roleLabel="Lab" sideNav={nav} bottomNav={nav} profileTo="/lab/dashboard" />,
});
