import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { CalendarCheck, Users, Video, FileText, Calendar, Wallet, User } from "lucide-react";
import { RoleShell, type NavItem } from "@/components/site/role-shell";

const nav: NavItem[] = [
  { to: "/doctor/dashboard", label: "Today's Appointments", icon: CalendarCheck },
  { to: "/doctor/patients", label: "Patient Records", icon: Users },
  { to: "/doctor/video", label: "Video Consultation", icon: Video },
  { to: "/doctor/prescriptions", label: "Prescriptions", icon: FileText },
  { to: "/doctor/calendar", label: "Calendar", icon: Calendar },
  { to: "/doctor/earnings", label: "Earnings", icon: Wallet },
  { to: "/doctor/profile", label: "Profile", icon: User },
];
const bottom: NavItem[] = [
  { to: "/doctor/dashboard", label: "Today", icon: CalendarCheck },
  { to: "/doctor/patients", label: "Patients", icon: Users },
  { to: "/doctor/video", label: "Video", icon: Video },
  { to: "/doctor/prescriptions", label: "Rx", icon: FileText },
  { to: "/doctor/profile", label: "Me", icon: User },
];
export const Route = createFileRoute("/_authenticated/doctor")({
  beforeLoad: async ({ location }) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth", search: { redirect: location.href } });
    const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "doctor" });
    if (!data) throw redirect({ to: "/dashboard" });
  },
  component: () => <RoleShell roleLabel="Doctor" sideNav={nav} bottomNav={bottom} profileTo="/doctor/profile" />,
});