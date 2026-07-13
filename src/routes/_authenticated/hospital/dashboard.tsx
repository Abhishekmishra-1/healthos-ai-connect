import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/hospital/dashboard")({
  component: () => <GenericPage icon={LayoutDashboard} title="Hospital Dashboard" description="Live occupancy and admissions." items={[{ title: "ER queue", meta: "7 patients · 2 critical", status: "Active" }]} />,
});
