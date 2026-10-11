import { createFileRoute } from "@tanstack/react-router";
import { HospitalAppointmentsPage } from "@/components/hospital/portal-simple-pages";
export const Route = createFileRoute("/_authenticated/hospital/appointments")({ component: HospitalAppointmentsPage });