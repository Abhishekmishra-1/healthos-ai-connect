import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { useElderlyMode } from "@/hooks/use-elderly-mode";
import { cn } from "@/lib/utils";
import {
  Activity,
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileBarChart,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Pill,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  Stethoscope,
  UserRound,
  Users,
  X,
} from "lucide-react";

export type HospitalNavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };
export type HospitalNavGroup = { label: string; items: readonly HospitalNavItem[] };

export const hospitalNavGroups: readonly HospitalNavGroup[] = [
  { label: "Overview", items: [{ to: "/hospital/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Hospital",
    items: [
      { to: "/hospital/profile", label: "Hospital Profile", icon: Building2 },
      { to: "/hospital/departments", label: "Departments", icon: ClipboardList },
    ],
  },
  {
    label: "People",
    items: [
      { to: "/hospital/doctors", label: "Doctors", icon: Stethoscope },
      { to: "/hospital/staff", label: "Staff", icon: Users },
      { to: "/hospital/patients", label: "Patients", icon: UserRound },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/hospital/appointments", label: "Appointments", icon: CalendarDays },
      { to: "/hospital/admissions", label: "Admissions", icon: Activity },
      { to: "/hospital/beds", label: "Beds & Rooms", icon: Building2 },
      { to: "/hospital/emergency", label: "Emergency", icon: Siren },
    ],
  },
  {
    label: "Clinical",
    items: [
      { to: "/hospital/records", label: "Medical Records", icon: FileBarChart },
      { to: "/hospital/laboratory", label: "Laboratory", icon: FlaskConical },
      { to: "/hospital/pharmacy", label: "Pharmacy", icon: Pill },
    ],
  },
  {
    label: "Finance & insights",
    items: [
      { to: "/hospital/billing", label: "Billing", icon: ClipboardList },
      { to: "/hospital/analytics", label: "Reports & Analytics", icon: FileBarChart },
      { to: "/hospital/reviews", label: "Reviews", icon: MessageSquareText },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/hospital/notifications", label: "Notifications", icon: Bell },
      { to: "/hospital/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function HospitalPortalShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const elderly = useElderlyMode();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hospitalName, setHospitalName] = useState("CityCare Hospital");
  const [email, setEmail] = useState("");

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    let active = true;
    async function loadIdentity() {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      setEmail(data.user?.email ?? "");
      const metadataName = data.user?.user_metadata?.hospital_name;
      if (typeof metadataName === "string" && metadataName.trim()) setHospitalName(metadataName);
    }
    void loadIdentity();
    return () => { active = false; };
  }, []);

  const filteredGroups = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return hospitalNavGroups;
    return hospitalNavGroups
      .map((group) => ({ ...group, items: group.items.filter((item) => item.label.toLowerCase().includes(needle)) }))
      .filter((group) => group.items.length > 0);
  }, [search]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/hospital-login", search: { redirect: "/hospital/dashboard" }, replace: true });
  }

  const initials = hospitalName.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "HC";

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card px-4 py-5 transition-transform md:sticky md:top-0 md:h-dvh md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}>
        <div className="flex items-center justify-between px-2">
          <Link to="/hospital/dashboard" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"><ShieldCheck className="h-5 w-5" /></span>
            <span><span className="block text-sm font-bold tracking-tight">MEDOOGLE AI</span><span className="block text-[11px] text-muted-foreground">Hospital operations</span></span>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Close navigation" onClick={() => setOpen(false)}><X /></Button>
        </div>

        <div className="mt-7 rounded-xl border border-border bg-secondary/60 p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary text-xs font-bold">{initials}</span>
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{hospitalName}</p><p className="truncate text-xs text-muted-foreground">Hospital Admin</p></div>
            <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a module" aria-label="Find a hospital module" className="h-9 bg-background pl-9 text-xs" />
        </div>

        <nav className="mt-5 flex-1 space-y-5 overflow-y-auto pr-1" aria-label="Hospital portal navigation">
          {filteredGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
                  return <Link key={item.to} to={item.to} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
                    <item.icon className="h-4 w-4" />{item.label}
                  </Link>;
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border pt-4">
          <div className="mb-3 px-3 text-[11px] text-muted-foreground">{email || "Secure hospital account"}</div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</Button>
        </div>
      </aside>

      {open && <button className="fixed inset-0 z-40 bg-foreground/20 md:hidden" aria-label="Close navigation overlay" onClick={() => setOpen(false)} />}
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 md:px-8">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation" onClick={() => setOpen(true)}><Menu /></Button>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{pathname === "/hospital/dashboard" ? "Good morning, Hospital Admin" : "Hospital operations"}</p><p className="hidden text-xs text-muted-foreground sm:block">A clear view of today’s care delivery</p></div>
            <Button variant="ghost" size="icon" aria-label="Notifications" onClick={() => navigate({ to: "/hospital/notifications" })}><Bell className="h-4 w-4" /><span className="sr-only">Notifications</span></Button>
            <Button variant="ghost" size="icon" aria-label={elderly.on ? "Turn off large text mode" : "Turn on large text mode"} aria-pressed={elderly.on} onClick={() => elderly.toggle()}><Activity className="h-4 w-4" /></Button>
            <ThemeToggle />
            <Link to="/hospital/profile" className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground" aria-label="Hospital profile">{initials}</Link>
          </div>
        </header>
        <div className="mx-auto max-w-[1600px] px-4 py-6 pb-12 md:px-8 md:py-8"><Outlet /></div>
      </main>
    </div>
  );
}

export function PortalPageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
    <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{eyebrow ?? "Hospital portal"}</p><h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{title}</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p></div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>;
}

export function PortalCard({ title, description, action, children, className }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={cn("rounded-xl border border-border bg-card", className)}><div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4"><div><h2 className="text-sm font-semibold">{title}</h2>{description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}</div>{action}</div><div className="p-5">{children}</div></section>;
}

export function MetricCard({ label, value, detail, icon: Icon, tone = "default" }: { label: string; value: string; detail: string; icon: React.ComponentType<{ className?: string }>; tone?: "default" | "success" | "warning" | "danger" }) {
  const toneClass = { default: "bg-primary/10 text-primary", success: "bg-emerald-500/10 text-emerald-600", warning: "bg-amber-500/10 text-amber-600", danger: "bg-destructive/10 text-destructive" }[tone];
  return <div className="rounded-xl border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight">{value}</p></div><span className={cn("grid h-9 w-9 place-items-center rounded-lg", toneClass)}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-xs text-muted-foreground">{detail}</p></div>;
}

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "info" }) {
  const styles = { neutral: "bg-secondary text-secondary-foreground", success: "bg-emerald-500/10 text-emerald-700", warning: "bg-amber-500/10 text-amber-700", danger: "bg-destructive/10 text-destructive", info: "bg-primary/10 text-primary" }[tone];
  return <Badge variant="outline" className={cn("border-0 font-medium", styles)}>{children}</Badge>;
}

export function SectionEmpty({ title, description, icon: Icon = ClipboardList }: { title: string; description: string; icon?: React.ComponentType<{ className?: string }> }) {
  return <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/20 px-6 text-center"><span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><p className="mt-3 text-sm font-semibold">{title}</p><p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p></div>;
}

export function PageTabs({ items, active }: { items: readonly { label: string; value: string }[]; active: string }) {
  return <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-border bg-secondary/40 p-1">{items.map((item) => <Link key={item.value} to={item.value} className={cn("whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium text-muted-foreground", active === item.value && "bg-background text-foreground shadow-sm")}>{item.label}</Link>)}</div>;
}