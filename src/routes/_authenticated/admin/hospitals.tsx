import { createFileRoute } from "@tanstack/react-router";
import { AdminCrud } from "@/components/site/admin-crud";

export const Route = createFileRoute("/_authenticated/admin/hospitals")({
  component: () => (
    <AdminCrud
      title="Hospitals"
      description="Manage hospital listings and emergency availability."
      table="catalog_hospitals"
      searchKeys={["name", "city", "phone"]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "city", label: "City" },
        { key: "address", label: "Address" },
        { key: "phone", label: "Phone" },
        { key: "category", label: "Category" },
        { key: "emergency", label: "24×7 Emergency", type: "boolean" },
        { key: "active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});