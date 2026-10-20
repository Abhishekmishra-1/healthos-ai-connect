import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/laboratory")({
  beforeLoad: () => {
    throw redirect({ to: "/lab/dashboard" });
  },
});
