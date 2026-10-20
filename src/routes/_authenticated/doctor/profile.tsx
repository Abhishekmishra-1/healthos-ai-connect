import { createFileRoute } from "@tanstack/react-router";
import { ProviderProfileForm, type ProviderSection } from "@/components/provider/provider-profile-form";

const sections: ProviderSection[] = [
  { title: "Personal & professional", fields: [
    { key: "full_name", label: "Full name", required: true },
    { key: "designation", label: "Designation", placeholder: "Consultant Physician" },
    { key: "qualifications", label: "Qualifications", required: true, placeholder: "MBBS, MD" },
    { key: "specialty", label: "Specialty", required: true, placeholder: "General Medicine" },
    { key: "experience_years", label: "Experience (years)", type: "number" },
    { key: "languages", label: "Languages", placeholder: "Hindi, English" },
    { key: "biography", label: "About you", type: "textarea" },
  ] },
  { title: "Clinic & availability", fields: [
    { key: "clinic_name", label: "Clinic / hospital name" },
    { key: "practice_address", label: "Practice address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "pincode", label: "PIN code" },
    { key: "available_days", label: "Available days", placeholder: "Mon–Sat" },
    { key: "working_hours", label: "Working hours", placeholder: "10:00–14:00" },
    { key: "in_person_available", label: "In-person consultation", type: "boolean" },
    { key: "online_available", label: "Online consultation", type: "boolean" },
  ] },
  { title: "Fees (₹)", fields: [
    { key: "in_person_fee", label: "In-person fee", type: "number" },
    { key: "online_fee", label: "Online fee", type: "number" },
    { key: "followup_fee", label: "Follow-up fee", type: "number" },
  ] },
  { title: "Verification", fields: [
    { key: "registration_number", label: "Medical registration number", required: true },
    { key: "issuing_authority", label: "Issuing council", required: true, placeholder: "Maharashtra Medical Council" },
    { key: "certificate_path", label: "Registration certificate", type: "file", required: true },
    { key: "phone", label: "Contact phone (private)" },
    { key: "registered_email", label: "Contact email (private)" },
  ] },
];

export const Route = createFileRoute("/_authenticated/doctor/profile")({
  head: () => ({ meta: [{ title: "Doctor profile — MEDOOGLE AI" }] }),
  component: () => <ProviderProfileForm table="provider_doctor_profiles" title="Doctor profile" sections={sections} />,
});
