import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { GenericPage } from "@/components/site/generic-page";
export const Route = createFileRoute("/_authenticated/pharmacy/orders")({
  component: () => <GenericPage icon={ShoppingBag} title="Orders" description="Accept, pack and dispatch incoming orders." items={[{ title: "#P-1042 · Ramesh S.", meta: "₹640 · 3 items", status: "New" },{ title: "#P-1041 · Priya M.", meta: "₹120 · 1 item", status: "Packing" }]} />,
});
