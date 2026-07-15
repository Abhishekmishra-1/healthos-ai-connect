import { createFileRoute } from "@tanstack/react-router";
import { AdminCrud } from "@/components/site/admin-crud";

export const Route = createFileRoute("/_authenticated/admin/pharmacies")({
  component: () => (
    <AdminCrud
      title="Pharmacies"
      description="Manage partnered pharmacies across cities."
      table="catalog_pharmacies"
      searchKeys={["name", "city", "phone"]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "city", label: "City" },
        { key: "address", label: "Address" },
        { key: "phone", label: "Phone" },
        { key: "active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});