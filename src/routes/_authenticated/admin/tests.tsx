import { createFileRoute } from "@tanstack/react-router";
import { AdminCrud } from "@/components/site/admin-crud";

export const Route = createFileRoute("/_authenticated/admin/tests")({
  component: () => (
    <AdminCrud
      title="Lab Tests"
      description="Master list of diagnostic tests."
      table="catalog_tests"
      searchKeys={["name", "category"]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "category", label: "Category" },
        { key: "price", label: "Price (₹)", type: "number" },
        { key: "home_collection", label: "Home collection", type: "boolean" },
        { key: "active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});