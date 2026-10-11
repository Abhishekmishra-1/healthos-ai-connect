import { createFileRoute } from "@tanstack/react-router";
import { HospitalPharmacyPage } from "@/components/hospital/portal-simple-pages";
export const Route = createFileRoute("/_authenticated/hospital/pharmacy")({ component: HospitalPharmacyPage });