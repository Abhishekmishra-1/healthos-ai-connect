import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { StubPage } from "@/components/site/stub-page";

export const Route = createFileRoute("/_authenticated/family")({
  head: () => ({ meta: [{ title: "Family — HealthOS AI" }] }),
  component: () => (
    <StubPage
      icon={Users}
      title="Family Health"
      description="Manage prescriptions, reports, and reminders for your entire family from one account."
      features={[
        "Add family members",
        "Shared health timeline",
        "Elderly parents care mode",
        "Kids vaccination tracker",
        "Emergency contact tree",
        "Family insurance overview",
      ]}
    />
  ),
});