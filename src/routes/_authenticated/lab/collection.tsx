import { createFileRoute } from "@tanstack/react-router";
import { TestTube } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/lab/collection")({
  component: () => <GenericPage icon={TestTube} title="Sample Collection" description="Phlebotomist queue and chain-of-custody." items={[{ title: "Phleb Ravi", meta: "4 collections · Bandra route", status: "En route" }]} />,
});
