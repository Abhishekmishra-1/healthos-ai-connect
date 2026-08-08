import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Menu, X, Search, Bell, LogOut, Accessibility, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useElderlyMode } from "@/hooks/use-elderly-mode";
import { ThemeToggle } from "@/components/site/theme-toggle";

export type NavItem = { to: string; label: string; icon: LucideIcon };

export function RoleShell({
  roleLabel,
  sideNav,
  bottomNav,
  profileTo,
}: {
  roleLabel: string;
  sideNav: readonly NavItem[];
  bottomNav: readonly NavItem[];
  profileTo: string;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const elderly = useElderlyMode();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      setName((((data.user?.user_metadata as any)?.full_name) ?? data.user?.email?.split("@")[0] ?? "") as string);
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
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border/60 bg-card/70 px-4 py-6 backdrop-blur-xl transition-transform md:sticky md:top-0 md:h-dvh md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}>
          <Link to={sideNav[0].to} className="mb-2 flex items-center gap-2 px-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-white shadow-glow"><Sparkles className="h-4 w-4" /></span>
            <span className="text-[15px] font-semibold tracking-tight">MEDOOGLE <span className="gradient-brand-text">AI</span></span>
          </Link>
          <div className="mb-6 px-2 text-xs uppercase tracking-wider text-muted-foreground">{roleLabel} Portal</div>
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {sideNav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link key={item.label} to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                    active ? "gradient-brand text-white shadow-glow" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
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
          <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-10">
              <button onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-secondary md:hidden" aria-label="Menu">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="relative flex-1 min-w-0">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="search" placeholder={`Search ${roleLabel.toLowerCase()} tools…`} className="w-full rounded-full border border-border/60 bg-secondary/50 py-2.5 pl-11 pr-4 text-sm outline-none focus:bg-background focus:ring-2 focus:ring-primary/40" />
              </div>
              <button
                onClick={() => elderly.toggle()}
                aria-pressed={elderly.on}
                aria-label={elderly.on ? "Turn off large text mode" : "Turn on large text mode"}
                title={elderly.on ? "Large text: on" : "Large text: off"}
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-full transition",
                  elderly.on ? "gradient-brand text-white shadow-glow" : "hover:bg-secondary",
                )}
              >
                <Accessibility className="h-5 w-5" />
              </button>
              <ThemeToggle />
              <button className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-secondary" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <Link to={profileTo} className="grid h-10 w-10 shrink-0 place-items-center rounded-full gradient-brand text-sm font-semibold text-white shadow-glow" aria-label="Profile">
                {initial}
              </Link>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-4 py-6 pb-28 md:px-10 md:py-10 md:pb-10">
            <Outlet />
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/90 backdrop-blur-xl md:hidden">
        <div className={cn("grid", `grid-cols-${bottomNav.length}`)} style={{ gridTemplateColumns: `repeat(${bottomNav.length}, minmax(0, 1fr))` }}>
          {bottomNav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link key={item.label} to={item.to} className={cn("flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition", active ? "gradient-brand-text" : "text-muted-foreground")}>
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

export function PageHero({
  icon: Icon,
  title,
  description,
  actions,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 rounded-3xl border border-border/60 bg-card p-6 shadow-glow md:p-8">
      <div className="flex flex-wrap items-start gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl gradient-brand text-white shadow-glow">
          <Icon className="h-6 w-6" />
        </span>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">{description}</p>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-3xl border border-border/60 bg-card p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
}: {
  columns: { key: keyof T | string; label: string; render?: (row: T) => React.ReactNode }[];
  rows: T[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            {columns.map((c) => (
              <th key={String(c.key)} className="py-2 pr-4 font-medium">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border/40 last:border-0">
              {columns.map((c) => (
                <td key={String(c.key)} className="py-3 pr-4 align-top">
                  {c.render ? c.render(row) : (row as any)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type { ComponentType };