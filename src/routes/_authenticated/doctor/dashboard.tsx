import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Users, Star, Wallet } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/doctor/dashboard")({
  head: () => ({ meta: [{ title: "Today — Doctor" }] }),
  component: () => (
    <GenericPage icon={CalendarCheck} title="Today's Appointments"
      description="Your consultations, patient queue and quick actions for the day."
      stats={[
        { label: "Booked today", value: "12", sub: "3 walk-ins", icon: CalendarCheck },
        { label: "Patients seen", value: "5", sub: "42 min avg", icon: Users },
        { label: "Rating", value: "4.9", sub: "268 reviews", icon: Star },
        { label: "Today earnings", value: "₹8,400", sub: "+12% vs yesterday", icon: Wallet },
      ]}
      items={[
        { title: "Aarti Kulkarni — Follow up (Diabetes)", meta: "10:30 AM · Video", status: "Upcoming" },
        { title: "Rohit Verma — General consult", meta: "11:00 AM · Clinic", status: "Upcoming" },
        { title: "Sneha Iyer — Pediatric", meta: "9:00 AM · Clinic", status: "Completed" },
      ]} />
  ),
});