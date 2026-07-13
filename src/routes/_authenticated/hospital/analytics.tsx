import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/hospital/analytics")({
  component: () => <GenericPage icon={BarChart3} title="Analytics" description="Occupancy, revenue and department mix." items={[{ title: "MTD revenue", meta: "₹4.2Cr · +14%", status: "▲" }]} />,
});
