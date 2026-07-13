import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/doctor/prescriptions")({
  component: () => <GenericPage icon={FileText} title="Prescriptions" description="Create, sign and share e-prescriptions instantly."
    items={[
      { title: "Rx #4821 · Aarti Kulkarni", meta: "Metformin 500mg · 30 tabs", status: "Sent" },
      { title: "Rx #4820 · Rohit Verma", meta: "Azithromycin 500mg · 5 tabs", status: "Sent" },
    ]} />,
});
