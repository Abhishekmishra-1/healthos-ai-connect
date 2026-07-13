import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/lab/dashboard")({
  component: () => <GenericPage icon={BarChart3} title="Lab Dashboard" description="Bookings, samples and TAT overview." items={[{ title: "Samples in transit", meta: "18 samples · 4 routes", status: "Active" }]} />,
});
