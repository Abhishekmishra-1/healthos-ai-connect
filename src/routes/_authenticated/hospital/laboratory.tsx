import { createFileRoute } from "@tanstack/react-router";
import { HospitalLaboratoryPage } from "@/components/hospital/portal-simple-pages";
export const Route = createFileRoute("/_authenticated/hospital/laboratory")({ component: HospitalLaboratoryPage });