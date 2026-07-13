import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/pharmacy/analytics")({
  component: () => <GenericPage icon={BarChart3} title="Analytics" description="Revenue trends and top movers." items={[{ title: "Top SKU · Paracetamol", meta: "412 units this month", status: "▲" }]} />,
});
