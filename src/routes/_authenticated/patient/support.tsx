import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, Mail, LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/support")({
  head: () => ({ meta: [{ title: "Support — MEDOOGLE AI" }] }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Need Help?</h1>
        <p className="mt-1 text-muted-foreground">We're here 24×7. Tap any option below.</p>
      </div>

      <div className="grid gap-3">
        <a href="tel:18001234567" className="flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-5 hover:shadow-glow">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600"><Phone className="h-6 w-6" /></span>
          <div>
            <p className="text-lg font-semibold">Call Support</p>
            <p className="text-sm text-muted-foreground">1800-123-4567 · Free</p>
          </div>
        </a>
        <a href="https://wa.me/911800000000" className="flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-5 hover:shadow-glow">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sky-100 text-sky-600"><MessageCircle className="h-6 w-6" /></span>
          <div>
            <p className="text-lg font-semibold">Chat on WhatsApp</p>
            <p className="text-sm text-muted-foreground">Reply within 5 minutes</p>
          </div>
        </a>
        <a href="mailto:help@medoogle.ai" className="flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-5 hover:shadow-glow">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-600"><Mail className="h-6 w-6" /></span>
          <div>
            <p className="text-lg font-semibold">Email Us</p>
            <p className="text-sm text-muted-foreground">help@medoogle.ai</p>
          </div>
        </a>
      </div>

      <div className="rounded-3xl border border-border/60 bg-secondary/40 p-5">
        <div className="flex items-center gap-3">
          <LifeBuoy className="h-5 w-5 text-primary" />
          <p className="text-sm font-semibold">Prefer a callback?</p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Share your number and our team will call you within 10 minutes.</p>
      </div>
    </div>
  );
}
