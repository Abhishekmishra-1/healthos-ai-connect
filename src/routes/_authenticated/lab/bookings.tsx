import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/lab/bookings")({
  component: () => <GenericPage icon={CalendarCheck} title="Test Bookings" description="Upcoming home collections and walk-ins." items={[{ title: "Aarti K. · CBC + LFT", meta: "Home · 8:30 AM", status: "Scheduled" }]} />,
});
