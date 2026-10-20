import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { User, ListChecks, BarChart3, CalendarCheck, TestTube, FileText, Wallet } from "lucide-react";
import { RoleShell, type NavItem } from "@/components/site/role-shell";
const nav: NavItem[] = [
  { to: "/lab/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/lab/bookings", label: "Test Bookings", icon: CalendarCheck },
  { to: "/lab/collection", label: "Sample Collection", icon: TestTube },
  { to: "/lab/reports", label: "Reports", icon: FileText },
  { to: "/lab/payments", label: "Payments", icon: Wallet },
  { to: "/lab/tests", label: "My Tests", icon: ListChecks },
  { to: "/lab/profile", label: "Profile & Verification", icon: User },
];
export const Route = createFileRoute("/_authenticated/lab")({
  beforeLoad: async ({ location }) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth", search: { redirect: location.href } });
    let { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "lab" });
    if (!data) {
      // First visit after sign-up: create the profile + default patient role, then re-check.
      const { data: bootstrapped } = await supabase.rpc("bootstrap_current_user");
      if (bootstrapped === "lab") data = true;
    }
    if (!data) throw redirect({ to: "/dashboard" });
  },
  component: () => <RoleShell roleLabel="Lab" sideNav={nav} bottomNav={[nav[0], nav[1], nav[5], nav[6]]} profileTo="/lab/profile" />,
});
