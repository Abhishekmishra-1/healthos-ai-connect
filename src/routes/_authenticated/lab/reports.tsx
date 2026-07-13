import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/lab/reports")({
  component: () => <GenericPage icon={FileText} title="Reports" description="Verified reports ready for release." items={[{ title: "CBC · Aarti Kulkarni", meta: "Verified", status: "Release" }]} />,
});
