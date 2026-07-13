import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/lab/payments")({
  component: () => <GenericPage icon={Wallet} title="Payments" description="Test revenue and settlements." items={[{ title: "Settlement · 12 Jul", meta: "₹84,200 credited", status: "Paid" }]} />,
});
