import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/pharmacy/inventory")({
  component: () => <GenericPage icon={Package} title="Inventory" description="Stock, expiry and low-stock alerts across all SKUs." items={[{ title: "Metformin 500mg", meta: "Batch M2401 · Exp 06/2027", status: "In stock · 128" },{ title: "Paracetamol 650mg", meta: "Batch P8812 · Exp 12/2026", status: "Low · 6" }]} />,
});
