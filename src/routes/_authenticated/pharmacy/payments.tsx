import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/pharmacy/payments")({
  component: () => <GenericPage icon={Wallet} title="Payments" description="Settlements, refunds and invoices." items={[{ title: "Settlement · 12 Jul", meta: "₹1,24,300 credited", status: "Paid" }]} />,
});
