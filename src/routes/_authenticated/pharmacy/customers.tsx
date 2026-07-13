import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/pharmacy/customers")({
  component: () => <GenericPage icon={Users} title="Customers" description="Repeat customers, subscriptions and outreach." items={[{ title: "Ramesh Sharma", meta: "12 orders · ₹8,240 lifetime", status: "Loyal" },{ title: "Priya Menon", meta: "3 orders · ₹1,120", status: "New" }]} />,
});
