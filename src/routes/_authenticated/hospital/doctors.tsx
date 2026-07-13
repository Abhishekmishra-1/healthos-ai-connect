import { createFileRoute } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/hospital/doctors")({
  component: () => <GenericPage icon={Stethoscope} title="Doctors" description="Empanelled doctors and schedules." items={[{ title: "Dr. Kavita Shah · Cardiology", meta: "Mon–Fri · 10–1", status: "Available" }]} />,
});
