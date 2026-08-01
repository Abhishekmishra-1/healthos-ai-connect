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
  beforeLoad: async ({ location }) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth", search: { redirect: location.href } });
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).limit(1).maybeSingle();
    let roleName = (r?.role as string) ?? "";
    if (!roleName) {
      // No role row yet (fresh account) — create profile + patient access.
      const { data: bootstrapped } = await supabase.rpc("bootstrap_current_user");
      roleName = (bootstrapped as string | null) ?? "patient";
    }
    throw redirect({ to: map[roleName] ?? "/patient/dashboard" });
  },
  component: () => null,
});