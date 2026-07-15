import { createFileRoute } from "@tanstack/react-router";
import { AdminCrud } from "@/components/site/admin-crud";

export const Route = createFileRoute("/_authenticated/admin/medicines")({
  component: () => (
    <AdminCrud
      title="Medicines"
      description="Master list of medicines available in the app."
      table="catalog_medicines"
      searchKeys={["name", "brand", "category"]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "brand", label: "Brand" },
        { key: "category", label: "Category" },
        { key: "price", label: "Price (₹)", type: "number" },
        { key: "requires_prescription", label: "Prescription required", type: "boolean" },
        { key: "active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});