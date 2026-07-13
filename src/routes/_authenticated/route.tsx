import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Pill, Stethoscope, FlaskConical, FolderHeart, Bot, Siren,
  ShoppingBag, CalendarCheck, Users, Wallet, Settings, LifeBuoy, LogOut,
  Sparkles, Menu, X, Search, Bell, Home, User as UserIcon,
} from "lucide-react";
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

const sideNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { to: "/medicine", label: "Medicine", icon: Pill },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/labs", label: "Labs", icon: FlaskConical },
  { to: "/records", label: "Health Records", icon: FolderHeart },
  { to: "/emergency", label: "Emergency", icon: Siren },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/reminders", label: "Reminders", icon: Pill },
  { to: "/profile", label: "Family & Profile", icon: Users },
  { to: "/profile", label: "Wallet", icon: Wallet },
  { to: "/profile", label: "Settings", icon: Settings },
  { to: "/profile", label: "Support", icon: LifeBuoy },
] as const;

const bottomNav = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/medicine", label: "Medicine", icon: Pill },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/labs", label: "Labs", icon: FlaskConical },
  { to: "/records", label: "Records", icon: FolderHeart },
  { to: "/profile", label: "Profile", icon: UserIcon },
] as const;

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      setName(((data.user?.user_metadata as any)?.full_name ?? data.user?.email?.split("@")[0] ?? "") as string);
    });
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const initial = (name || email || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border/60 bg-card/70 px-4 py-6 backdrop-blur-xl transition-transform md:sticky md:top-0 md:h-dvh md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}>
          <Link to="/dashboard" className="mb-8 flex items-center gap-2 px-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-white shadow-glow"><Sparkles className="h-4 w-4" /></span>
            <span className="text-[15px] font-semibold tracking-tight">HealthOS <span className="gradient-brand-text">AI</span></span>
          </Link>
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {sideNav.map((item, idx) => {
              const active = pathname === item.to && idx < 11;
              return (
                <Link key={item.label} to={item.to}
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
          <button onClick={signOut} className="mt-2 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </aside>

        {open && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />}

        <main className="flex-1 min-w-0">
          {/* Top header — appears on every page */}
          <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-10">
              <button
                onClick={() => setOpen((o) => !o)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-secondary md:hidden"
                aria-label="Menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Link to="/dashboard" className="flex shrink-0 items-center gap-2 md:hidden">
                <span className="grid h-8 w-8 place-items-center rounded-xl gradient-brand text-white shadow-glow"><Sparkles className="h-4 w-4" /></span>
              </Link>
              <div className="relative flex-1 min-w-0">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search medicines, doctors, labs, records…"
                  className="w-full rounded-full border border-border/60 bg-secondary/50 py-2.5 pl-11 pr-4 text-sm outline-none focus:bg-background focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <button className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-secondary" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <Link to="/profile" className="grid h-10 w-10 shrink-0 place-items-center rounded-full gradient-brand text-sm font-semibold text-white shadow-glow" aria-label="Profile">
                {initial}
              </Link>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-4 py-6 pb-28 md:px-10 md:py-10 md:pb-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/90 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-6">
          {bottomNav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition",
                  active ? "gradient-brand-text" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", active && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}