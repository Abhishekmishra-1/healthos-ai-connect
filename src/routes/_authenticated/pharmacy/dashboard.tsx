import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/pharmacy/dashboard")({
  component: () => <GenericPage icon={BarChart3} title="Pharmacy Dashboard" description="Live overview of orders, inventory and revenue." items={[{ title: "Order #P-1042 · Ramesh S.", meta: "3 items · ₹640", status: "Packed" },{ title: "Order #P-1041 · Priya M.", meta: "1 item · ₹120", status: "Out for delivery" }]} />,
});
