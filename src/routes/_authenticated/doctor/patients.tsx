import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/doctor/patients")({
  component: () => <GenericPage icon={Users} title="Patient Records" description="Search and manage records for all your patients."
    items={[
      { title: "Aarti Kulkarni · 42F", meta: "Last visit 2 days ago · Diabetes, Hypertension", status: "Active" },
      { title: "Rohit Verma · 31M", meta: "Last visit 1 week ago · General", status: "Active" },
      { title: "Sneha Iyer · 6F", meta: "Last visit 3 weeks ago · Pediatric", status: "Follow up" },
    ]} />,
});
