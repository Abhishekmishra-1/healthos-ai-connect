import { createFileRoute } from "@tanstack/react-router";
import { HospitalNotificationsPage } from "@/components/hospital/portal-simple-pages";
export const Route = createFileRoute("/_authenticated/hospital/notifications")({ component: HospitalNotificationsPage });