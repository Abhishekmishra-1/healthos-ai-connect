import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { HospitalPortalShell } from "@/components/hospital/portal-shell";
export const Route = createFileRoute("/_authenticated/hospital")({
  beforeLoad: async ({ location }) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth", search: { redirect: location.href } });
    let { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "hospital" });
    if (!data) {
      // First visit after sign-up: create the profile + default patient role, then re-check.
      const { data: bootstrapped } = await supabase.rpc("bootstrap_current_user");
      if (bootstrapped === "hospital") data = true;
    }
    if (!data) throw redirect({ to: "/dashboard" });
  },
  component: () => <HospitalPortalShell />,
});
