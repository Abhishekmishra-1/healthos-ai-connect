import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy } from "lucide-react";
import { StubPage } from "@/components/site/stub-page";

export const Route = createFileRoute("/_authenticated/support")({
  head: () => ({ meta: [{ title: "Support — HealthOS AI" }] }),
  component: () => (
    <StubPage
      icon={LifeBuoy}
      title="24×7 Support"
      description="Chat, call, or email our care team — in your language, whenever you need us."
      features={[
        "Live chat with humans",
        "Call back in 5 minutes",
        "WhatsApp support",
        "Email tickets",
        "Help center articles",
        "Report a safety issue",
      ]}
    />
  ),
});