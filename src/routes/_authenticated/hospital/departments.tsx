import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/hospital/departments")({
  component: () => <GenericPage icon={Building2} title="Departments" description="All clinical departments." items={[{ title: "Cardiology", meta: "12 doctors · 24 beds", status: "Active" },{ title: "Pediatrics", meta: "8 doctors · 18 beds", status: "Active" }]} />,
});
