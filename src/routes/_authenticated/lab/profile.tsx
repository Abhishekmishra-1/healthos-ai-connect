import { createFileRoute } from "@tanstack/react-router";
import { ProviderProfileForm, type ProviderSection } from "@/components/provider/provider-profile-form";

const sections: ProviderSection[] = [
  { title: "Laboratory details", fields: [
    { key: "lab_name", label: "Laboratory name", required: true },
    { key: "lab_type", label: "Type", placeholder: "Pathology / Diagnostic centre" },
    { key: "description", label: "About the laboratory", type: "textarea" },
    { key: "services", label: "Services", type: "textarea", placeholder: "Blood tests, X-ray, ECG" },
  ] },
  { title: "Location & hours", fields: [
    { key: "address", label: "Address", required: true },
    { key: "city", label: "City", required: true },
    { key: "district", label: "District" },
    { key: "state", label: "State" },
    { key: "pincode", label: "PIN code" },
    { key: "maps_url", label: "Google Maps link" },
    { key: "opening_hours", label: "Opening hours", placeholder: "7:00–20:00" },
    { key: "business_phone", label: "Business phone", required: true },
    { key: "business_email", label: "Business email" },
    { key: "contact_person", label: "Contact person" },
  ] },
  { title: "Home sample collection", fields: [
    { key: "home_collection", label: "Offer home collection", type: "boolean" },
    { key: "home_collection_areas", label: "Areas covered" },
    { key: "home_collection_charge", label: "Collection charge (₹)", type: "number" },
  ] },
  { title: "Verification", fields: [
    { key: "registration_number", label: "Registration / licence number", required: true },
    { key: "issuing_authority", label: "Issuing authority", required: true },
    { key: "certificate_path", label: "Registration certificate", type: "file", required: true },
    { key: "accreditation_details", label: "Accreditation (e.g. NABL)" },
    { key: "accreditation_certificate_path", label: "Accreditation certificate", type: "file" },
  ] },
];

export const Route = createFileRoute("/_authenticated/lab/profile")({
  head: () => ({ meta: [{ title: "Laboratory profile — MEDOOGLE AI" }] }),
  component: () => <ProviderProfileForm table="provider_lab_profiles" title="Laboratory profile" sections={sections} />,
});
