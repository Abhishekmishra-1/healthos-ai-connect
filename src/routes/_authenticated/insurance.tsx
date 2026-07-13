import { createFileRoute } from "@tanstack/react-router";
import { FolderHeart } from "lucide-react";
import { StubPage } from "@/components/site/stub-page";

export const Route = createFileRoute("/_authenticated/insurance")({
  head: () => ({ meta: [{ title: "Insurance — HealthOS AI" }] }),
  component: () => (
    <StubPage
      icon={FolderHeart}
      title="Insurance"
      description="Cashless hospitalisation, claims tracking, and top-up policies for your family."
      features={[
        "Add existing policies",
        "Cashless network hospitals",
        "Claim status tracking",
        "OPD reimbursements",
        "Top-up and super top-up",
        "Ayushman Bharat integration",
      ]}
    />
  ),
});