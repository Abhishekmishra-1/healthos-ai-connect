import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/doctor/profile")({
  component: () => <GenericPage icon={User} title="Doctor Profile" description="Registration, specialization, clinic details and payouts."
    items={[
      { title: "MCI Registration", meta: "Verified · MH-45821", status: "Verified" },
      { title: "Specialization", meta: "Internal Medicine · 12 yrs", status: "Active" },
    ]} />,
});
