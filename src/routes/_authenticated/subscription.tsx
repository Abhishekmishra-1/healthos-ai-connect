import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { StubPage } from "@/components/site/stub-page";

export const Route = createFileRoute("/_authenticated/subscription")({
  head: () => ({ meta: [{ title: "Subscription — HealthOS AI" }] }),
  component: () => (
    <StubPage
      icon={Sparkles}
      title="HealthOS Plus"
      description="Unlock unlimited AI consults, free deliveries, and family health packages."
      features={[
        "Unlimited AI health chats",
        "Free medicine delivery",
        "Priority lab collection",
        "Family plan for 6 members",
        "Second opinions from specialists",
        "Insurance concierge",
      ]}
    />
  ),
});