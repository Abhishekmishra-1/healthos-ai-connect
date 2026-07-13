import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { StubPage } from "@/components/site/stub-page";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — HealthOS AI" }] }),
  component: () => (
    <StubPage
      icon={Bell}
      title="Notifications"
      description="Medicine reminders, appointment alerts, lab reports, and emergency updates in one place."
      features={[
        "Medicine reminders",
        "Appointment alerts",
        "Lab report ready",
        "Emergency broadcasts",
        "Family activity",
        "Order tracking",
      ]}
    />
  ),
});