import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/hospital/patients")({
  component: () => <GenericPage icon={Users} title="Patients" description="Active and discharged patients." items={[{ title: "IP-2841 · Suresh Menon", meta: "Cardiology · Bed 12", status: "Admitted" }]} />,
});
