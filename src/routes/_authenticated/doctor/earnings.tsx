import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/doctor/earnings")({
  component: () => <GenericPage icon={Wallet} title="Earnings" description="Consultation revenue, payouts and settlements."
    stats={[
      { label: "This month", value: "₹1,84,200", sub: "+22% MoM", icon: Wallet },
      { label: "Pending payout", value: "₹42,600", icon: Wallet },
      { label: "Consults", value: "312", icon: Wallet },
      { label: "Refunds", value: "₹1,200", icon: Wallet },
    ]} />,
});
