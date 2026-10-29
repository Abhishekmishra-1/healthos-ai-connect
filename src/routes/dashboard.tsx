import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { pickPrimaryRole, dashboardFor } from "@/lib/role-landing";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth", search: { redirect: location.href } });
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
    let roleName = pickPrimaryRole(((roles ?? []) as { role: string }[]).map((row) => row.role));
    if (roleName === "patient" && !(roles ?? []).length) {
      // No role row yet (fresh account) — create profile + patient access.
      const { data: bootstrapped } = await supabase.rpc("bootstrap_current_user");
      roleName = (bootstrapped as string | null) ?? "patient";
    }
    throw redirect({ to: dashboardFor(roleName) });
  },
  component: () => null,
});