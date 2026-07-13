import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/hospital/billing")({
  component: () => <GenericPage icon={Receipt} title="Billing" description="Invoices, TPA claims and dues." items={[{ title: "INV-9812", meta: "₹84,200 · Star Health TPA", status: "Approved" }]} />,
});
