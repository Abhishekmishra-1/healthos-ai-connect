import { createFileRoute } from "@tanstack/react-router";
import { HospitalBedsPage } from "@/components/hospital/portal-simple-pages";
export const Route = createFileRoute("/_authenticated/hospital/beds")({ component: HospitalBedsPage });