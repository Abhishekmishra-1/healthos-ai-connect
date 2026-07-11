import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, FileText, FlaskConical, Clock, Pill, User, LogOut, Sparkles, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/upload-prescription", label: "Upload Prescription", icon: FileText },
  { to: "/app/upload-report", label: "Upload Lab Report", icon: FlaskConical },
  { to: "/app/timeline", label: "Health Timeline", icon: Clock },
  { to: "/app/reminders", label: "Medicine Reminders", icon: Pill },
  { to: "/app/profile", label: "Profile", icon: User },
] as const;

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur md:hidden">
        <Link to="/app" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl gradient-brand text-white shadow-glow"><Sparkles className="h-4 w-4" /></span>
          <span className="text-sm font-semibold">HealthOS <span className="gradient-brand-text">AI</span></span>
        </Link>
        <button onClick={() => setOpen((o) => !o)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-border/60 bg-card/50 px-4 py-6 backdrop-blur transition-transform md:sticky md:top-0 md:h-dvh md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}>
          <Link to="/app" className="mb-8 flex items-center gap-2 px-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-white shadow-glow"><Sparkles className="h-4 w-4" /></span>
            <span className="text-[15px] font-semibold tracking-tight">HealthOS <span className="gradient-brand-text">AI</span></span>
          </Link>
          <nav className="flex-1 space-y-1">
            {nav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link key={item.to} to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                    active ? "gradient-brand text-white shadow-glow" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={signOut} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </aside>

        {open && <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-6xl px-4 py-8 md:px-10 md:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}