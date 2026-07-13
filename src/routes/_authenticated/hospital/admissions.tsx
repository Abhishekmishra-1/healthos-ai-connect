import { createFileRoute } from "@tanstack/react-router";
import { BedDouble } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/hospital/admissions")({
  component: () => <GenericPage icon={BedDouble} title="Admissions" description="New admissions and discharges." items={[{ title: "Admit · Suresh Menon", meta: "Cardiology", status: "Today" }]} />,
});
