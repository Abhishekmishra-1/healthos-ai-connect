import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Sparkles, Loader2, User, Stethoscope, Pill, FlaskConical, Hospital, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  // Optional ?redirect=/some/path — where to land after a successful sign-in.
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — MEDOOGLE AI" },
      { name: "description", content: "Sign in or create your MEDOOGLE AI account to access your health records, reminders, and AI insights." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();
  const safeRedirect =
    redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : undefined;
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [method, setMethod] = useState<"email" | "otp">("email");
  const [role, setRole] = useState<"patient" | "doctor" | "pharmacy" | "lab" | "hospital">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleMap: Record<string, string> = {
      patient: "/patient/dashboard",
      doctor: "/doctor/dashboard",
      pharmacy: "/pharmacy/dashboard",
      lab: "/lab/dashboard",
      hospital: "/hospital/dashboard",
    };
    const go = async (userId: string) => {
      if (safeRedirect) {
        navigate({ to: safeRedirect } as never);
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).limit(1).maybeSingle();
      const r = (data?.role as string) ?? "patient";
      navigate({ to: roleMap[r] ?? "/patient/dashboard" });
    };
    supabase.auth.getSession().then(({ data }) => { if (data.session) go(data.session.user.id); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { if (session) go(session.user.id); });
    return () => sub.subscription.unsubscribe();
  }, [navigate, safeRedirect]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/dashboard",
            data: { full_name: name, role },
          },
        });
        if (error) throw error;
        toast.success(
          role === "patient"
            ? "Account created. You're signed in."
            : "Account created as a patient. Your professional account request is pending admin approval.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(friendlyAuthError(err), { duration: 8000 });
    } finally {
      setLoading(false);
    }
  }

  function normalizePhone(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (raw.trim().startsWith("+")) return "+" + digits;
    // Default to India country code for 10-digit numbers.
    if (digits.length === 10) return "+91" + digits;
    return "+" + digits;
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: normalizePhone(phone),
        options: { data: { full_name: name || undefined, role } },
      });
      if (error) throw error;
      setOtpSent(true);
      toast.success("OTP sent. Check your phone.");
    } catch (err: any) {
      toast.error(err.message ?? "Could not send OTP. Ask admin to enable phone auth.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: normalizePhone(phone),
        token: otp,
        type: "sms",
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message ?? "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri:
          window.location.origin +
          "/auth" +
          (safeRedirect ? `?redirect=${encodeURIComponent(safeRedirect)}` : ""),
      });
      if (result.error) throw result.error;
    } catch (err: any) {
      toast.error(err.message ?? "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 gradient-mesh opacity-70" />
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-white shadow-glow">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">MEDOOGLE <span className="gradient-brand-text">AI</span></span>
        </Link>

        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-glow">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Continue as</p>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {[
                { id: "patient", label: "Patient", icon: User },
                { id: "doctor", label: "Doctor", icon: Stethoscope },
                { id: "pharmacy", label: "Pharmacy", icon: Pill },
                { id: "lab", label: "Lab", icon: FlaskConical },
                { id: "hospital", label: "Hospital", icon: Hospital },
              ].map((r) => {
                const active = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as typeof role)}
                    className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-[11px] font-medium transition ${
                      active
                        ? "border-transparent gradient-brand text-white shadow-glow"
                        : "border-border bg-background text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <r.icon className="h-4 w-4" />
                    {r.label}
                  </button>
                );
              })}
            </div>
            {role !== "patient" && (
              <p className="mt-2 text-[11px] text-muted-foreground">
                Professional accounts start as patient access and need admin approval before the {role} portal unlocks.
              </p>
            )}
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to your health dashboard." : "Start managing your family's health, intelligently."}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-full bg-secondary p-1">
            <button
              type="button"
              onClick={() => setMethod("email")}
              className={`flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${method === "email" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              aria-pressed={method === "email"}
            >
              <Mail className="h-4 w-4" /> Email
            </button>
            <button
              type="button"
              onClick={() => { setMethod("otp"); setOtpSent(false); }}
              className={`flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${method === "otp" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              aria-pressed={method === "otp"}
            >
              <Phone className="h-4 w-4" /> Mobile OTP
            </button>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-secondary disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.3 29.4 35.5 24 35.5c-6.4 0-11.6-5.2-11.6-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.7 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29.1 4.5 24 4.5 16.2 4.5 9.4 8.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.9 12.9-5l-6-4.9c-2 1.4-4.4 2.4-6.9 2.4-5.3 0-9.8-3.2-11.3-7.7l-6.5 5C9.3 39 16.1 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6 4.9c-.4.4 6.5-4.8 6.5-14.5 0-1.2-.1-2.4-.4-3.5z"/></svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" />
          </div>

          {method === "email" && (
          <form onSubmit={handleEmail} className="space-y-3">
            {mode === "signup" && (
              <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
            )}
            <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
            <input required type="password" placeholder="Password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
            <button disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-glow disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          )}

          {method === "otp" && (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-3">
              {mode === "signup" && !otpSent && (
                <input placeholder="Full name (optional)" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
              )}
              <input required type="tel" inputMode="tel" placeholder="Mobile number (e.g. 9876543210)" value={phone}
                onChange={(e) => setPhone(e.target.value)} disabled={otpSent}
                className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-primary disabled:opacity-60" />
              {otpSent && (
                <input required inputMode="numeric" pattern="[0-9]*" maxLength={6} placeholder="Enter 6-digit OTP"
                  value={otp} onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:ring-2 focus:ring-primary" />
              )}
              <button disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full gradient-brand px-4 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-60">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {otpSent ? "Verify OTP" : "Send OTP"}
              </button>
              {otpSent && (
                <button type="button" onClick={() => { setOtpSent(false); setOtp(""); }}
                  className="w-full text-center text-xs text-muted-foreground underline">
                  Change number
                </button>
              )}
              <p className="text-center text-[11px] text-muted-foreground">
                Standard SMS charges may apply. Requires phone auth to be enabled.
              </p>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-semibold gradient-brand-text">
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}