import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/hospital-login")({
  validateSearch: (search: Record<string, unknown>) => ({ redirect: typeof search.redirect === "string" ? search.redirect : "/hospital/dashboard" }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const { data: isHospital } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "hospital" });
      if (isHospital) throw redirect({ to: "/hospital/dashboard" });
    }
  },
  head: () => ({ meta: [
    { title: "Hospital Login | MEDOOGLE AI" },
    { name: "description", content: "Secure sign in for MEDOOGLE AI hospital operations." },
    { property: "og:title", content: "Hospital Login | MEDOOGLE AI" },
    { property: "og:description", content: "Secure sign in for MEDOOGLE AI hospital operations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: HospitalLoginPage,
});

function HospitalLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError || !data.user) {
      setError("That email or password was not recognised.");
      setLoading(false);
      return;
    }
    const { data: isHospital } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "hospital" });
    if (!isHospital) {
      await supabase.auth.signOut();
      setError("This account does not have hospital access yet.");
      setLoading(false);
      return;
    }
    void remember;
    navigate({ to: "/hospital/dashboard" });
  }

  return <main className="grid min-h-dvh bg-background lg:grid-cols-[0.9fr_1.1fr]">
    <section className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
      <div><Link to="/" className="inline-flex items-center gap-3 text-sm font-bold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-foreground/15"><ShieldCheck className="h-5 w-5" /></span>MEDOOGLE AI</Link><div className="mt-24 max-w-md"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/70">Hospital operations</p><h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight">Run every shift with clarity.</h1><p className="mt-6 text-base leading-7 text-primary-foreground/75">One calm workspace for patients, doctors, appointments, beds, staff, and care delivery.</p></div></div>
      <div className="flex items-center gap-3 text-sm text-primary-foreground/70"><ShieldCheck className="h-4 w-4" /> Protected access for hospital teams</div>
    </section>
    <section className="flex items-center justify-center px-5 py-10 sm:px-8">
      <div className="w-full max-w-md"><div className="mb-10 flex items-center gap-3 lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="h-5 w-5" /></span><span className="text-sm font-bold">MEDOOGLE AI</span></div>
        <div className="mb-8"><span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-6 w-6" /></span><h2 className="mt-6 text-3xl font-bold tracking-tight">Welcome back</h2><p className="mt-2 text-sm text-muted-foreground">Sign in to your hospital workspace.</p></div>
        <form onSubmit={handleSubmit} className="space-y-5"><div><label htmlFor="hospital-email" className="mb-2 block text-sm font-medium">Work email</label><Input id="hospital-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@hospital.com" /></div><div><label htmlFor="hospital-password" className="mb-2 block text-sm font-medium">Password</label><div className="relative"><Input id="hospital-password" required minLength={6} type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="pr-11" /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff /> : <Eye />}</Button></div></div><div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="accent-primary" /> Remember me</label><Link to="/auth" className="font-semibold text-primary">Forgot password?</Link></div>{error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}<Button type="submit" className="h-11 w-full" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign in to hospital portal</Button></form>
        <p className="mt-8 text-center text-xs text-muted-foreground">Need access? Ask your organisation administrator to assign the Hospital group.</p>
      </div>
    </section>
  </main>;
}