import { createFileRoute } from "@tanstack/react-router";
import { HospitalSettingsPage } from "@/components/hospital/portal-simple-pages";
export const Route = createFileRoute("/_authenticated/hospital/settings")({ component: HospitalSettingsPage });