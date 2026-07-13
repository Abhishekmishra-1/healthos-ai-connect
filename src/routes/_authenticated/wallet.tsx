import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { StubPage } from "@/components/site/stub-page";

export const Route = createFileRoute("/_authenticated/wallet")({
  head: () => ({ meta: [{ title: "Wallet — HealthOS AI" }] }),
  component: () => (
    <StubPage
      icon={Wallet}
      title="HealthOS Wallet"
      description="Save on every order with HealthOS cash-back, refunds, and prepaid balance."
      features={[
        "Prepaid balance",
        "Cashback rewards",
        "Refund tracker",
        "Saved cards & UPI",
        "Subscription auto-pay",
        "Transaction history",
      ]}
    />
  ),
});