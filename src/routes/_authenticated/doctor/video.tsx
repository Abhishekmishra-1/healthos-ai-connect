import { createFileRoute } from "@tanstack/react-router";
import { Video } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/doctor/video")({
  component: () => <GenericPage icon={Video} title="Video Consultation" description="Start or join secure HD video calls with patients."
    items={[
      { title: "Aarti Kulkarni", meta: "Scheduled 10:30 AM", status: "Join" },
      { title: "Neha Rao", meta: "Scheduled 12:15 PM", status: "Join" },
    ]} />,
});
