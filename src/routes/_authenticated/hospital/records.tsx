import { createFileRoute } from "@tanstack/react-router";
import { HospitalRecordsPage } from "@/components/hospital/portal-simple-pages";
export const Route = createFileRoute("/_authenticated/hospital/records")({ component: HospitalRecordsPage });