import { createFileRoute } from "@tanstack/react-router";
import { HospitalReviewsPage } from "@/components/hospital/portal-simple-pages";
export const Route = createFileRoute("/_authenticated/hospital/reviews")({ component: HospitalReviewsPage });