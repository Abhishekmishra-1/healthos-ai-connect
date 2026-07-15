import { createFileRoute } from "@tanstack/react-router";
import { AdminCrud } from "@/components/site/admin-crud";

export const Route = createFileRoute("/_authenticated/admin/doctors")({
  component: () => (
    <AdminCrud
      title="Doctors"
      description="Add, edit and remove doctors listed in the app."
      table="catalog_doctors"
      searchKeys={["name", "specialty", "city", "clinic"]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "specialty", label: "Specialty", required: true, placeholder: "Cardiology" },
        { key: "city", label: "City" },
        { key: "clinic", label: "Clinic" },
        { key: "languages", label: "Languages", placeholder: "English, Hindi" },
        { key: "experience_years", label: "Experience (yrs)", type: "number" },
        { key: "fee", label: "Fee (₹)", type: "number" },
        { key: "active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});