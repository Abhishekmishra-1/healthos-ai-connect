import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// Map role -> landing dashboard
const roleDashboards: Record<string, string> = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  pharmacy: "/pharmacy/dashboard",
  lab: "/lab/dashboard",
  hospital: "/hospital/dashboard",
  admin: "/admin/dashboard",
};

export async function fetchCurrentRole(): Promise<string | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .limit(1)
    .maybeSingle();
  return (data?.role as string | undefined) ?? "patient";
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth", search: { redirect: location.href } });

    // At the bare /_authenticated (e.g. legacy /dashboard) — send to role home
    const path = location.pathname;
    const knownPrefix = ["/patient", "/doctor", "/pharmacy", "/lab", "/hospital", "/admin"].some((p) => path.startsWith(p));
    if (!knownPrefix) {
      const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).limit(1).maybeSingle();
      const role = (r?.role as string) ?? "patient";
      throw redirect({ to: roleDashboards[role] ?? "/patient/dashboard" });
    }
    return { user: data.user };
  },
  component: () => <Outlet />,
});