import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const map: Record<string, string> = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  pharmacy: "/pharmacy/dashboard",
  lab: "/lab/dashboard",
  hospital: "/hospital/dashboard",
};

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).limit(1).maybeSingle();
    throw redirect({ to: map[(r?.role as string) ?? "patient"] ?? "/patient/dashboard" });
  },
  component: () => null,
});