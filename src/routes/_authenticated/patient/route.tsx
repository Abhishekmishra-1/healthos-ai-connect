import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Bot, Pill, Stethoscope, FlaskConical, FolderHeart,
  ShoppingBag, CalendarCheck, User as UserIcon, Home,
} from "lucide-react";
import { RoleShell, type NavItem } from "@/components/site/role-shell";

const sideNav: NavItem[] = [
  { to: "/patient/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/patient/ai-assistant", label: "AI Health Assistant", icon: Bot },
  { to: "/patient/medicine", label: "Medicine", icon: Pill },
  { to: "/patient/doctors", label: "Doctor Consultation", icon: Stethoscope },
  { to: "/patient/labs", label: "Lab Tests", icon: FlaskConical },
  { to: "/patient/records", label: "Health Records", icon: FolderHeart },
  { to: "/patient/orders", label: "Orders", icon: ShoppingBag },
  { to: "/patient/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/patient/profile", label: "Profile", icon: UserIcon },
];

const bottomNav: NavItem[] = [
  { to: "/patient/dashboard", label: "Home", icon: Home },
  { to: "/patient/medicine", label: "Medicine", icon: Pill },
  { to: "/patient/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/patient/records", label: "Records", icon: FolderHeart },
  { to: "/patient/profile", label: "Profile", icon: UserIcon },
];

export const Route = createFileRoute("/_authenticated/patient")({
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "patient" });
    if (!data) throw redirect({ to: "/dashboard" });
  },
  component: () => <RoleShell roleLabel="Patient" sideNav={sideNav} bottomNav={bottomNav} profileTo="/patient/profile" />,
});