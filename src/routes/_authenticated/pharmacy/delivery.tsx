import { createFileRoute } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/pharmacy/delivery")({
  component: () => <GenericPage icon={Truck} title="Delivery" description="Live rider tracking and SLA monitoring." items={[{ title: "Rider Kiran · 3 orders", meta: "ETA 22 min", status: "En route" }]} />,
});
