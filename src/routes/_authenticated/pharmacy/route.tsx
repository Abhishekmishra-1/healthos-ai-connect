import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingBag, Users, Truck, BarChart3, Wallet } from "lucide-react";
import { RoleShell, type NavItem } from "@/components/site/role-shell";
const nav: NavItem[] = [
  { to: "/pharmacy/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/pharmacy/inventory", label: "Inventory", icon: Package },
  { to: "/pharmacy/orders", label: "Orders", icon: ShoppingBag },
  { to: "/pharmacy/customers", label: "Customers", icon: Users },
  { to: "/pharmacy/delivery", label: "Delivery", icon: Truck },
  { to: "/pharmacy/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/pharmacy/payments", label: "Payments", icon: Wallet },
];
export const Route = createFileRoute("/_authenticated/pharmacy")({
  beforeLoad: async ({ location }) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth", search: { redirect: location.href } });
    let { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "pharmacy" });
    if (!data) {
      // First visit after sign-up: create the profile + default patient role, then re-check.
      const { data: bootstrapped } = await supabase.rpc("bootstrap_current_user");
      if (bootstrapped === "pharmacy") data = true;
    }
    if (!data) throw redirect({ to: "/dashboard" });
  },
  component: () => <RoleShell roleLabel="Pharmacy" sideNav={nav} bottomNav={nav.slice(0,5)} profileTo="/pharmacy/dashboard" />,
});
