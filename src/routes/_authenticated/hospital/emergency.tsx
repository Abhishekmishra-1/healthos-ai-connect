import { createFileRoute } from "@tanstack/react-router";
import { Siren } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/hospital/emergency")({
  component: () => <GenericPage icon={Siren} title="Emergency" description="Live triage and ambulance intake." items={[{ title: "Amb #421 · Chest pain", meta: "ETA 4 min · Critical", status: "Incoming" }]} />,
});
