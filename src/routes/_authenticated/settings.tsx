import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { StubPage } from "@/components/site/stub-page";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — HealthOS AI" }] }),
  component: () => (
    <StubPage
      icon={Settings}
      title="Settings"
      description="Control your account, privacy, language, region and preferences."
      features={[
        "Language & region",
        "Notification preferences",
        "Privacy & data controls",
        "Connected devices",
        "Two-factor authentication",
        "Delete account",
      ]}
    />
  ),
});