import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/doctor/calendar")({
  component: () => <GenericPage icon={Calendar} title="Calendar" description="Weekly slots, availability and blocked hours."
    items={[
      { title: "Mon–Fri · 9:00 AM – 1:00 PM", meta: "Clinic hours", status: "Active" },
      { title: "Tue, Thu · 6:00 PM – 8:00 PM", meta: "Video hours", status: "Active" },
    ]} />,
});
