import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/simple-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — MEDOOGLE AI" },
      { name: "description", content: "How MEDOOGLE AI collects, uses and protects your health information." },
      { property: "og:title", content: "MEDOOGLE AI Privacy" },
      { property: "og:description", content: "Your health data belongs to you. Always." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <SimplePage eyebrow="Legal" title={<>Privacy <span className="gradient-brand-text">Policy</span></>}
      description="This page is maintained by MEDOOGLE AI to describe how we handle your personal and health information.">
      <div className="prose prose-neutral mt-10 max-w-none text-foreground/85">
        <h2>Overview</h2>
        <p>Your health data belongs to you. We collect only what is required to deliver the services you request, store it encrypted, and never sell it to third parties.</p>
        <h2>What we collect</h2>
        <p>Account details you provide, health records you upload, and interactions with the app that help us improve safety and reliability.</p>
        <h2>How we use it</h2>
        <p>To deliver medicines, book consultations, run diagnostics, and personalize the AI assistant. Aggregated, de-identified data may inform product research.</p>
        <h2>Your controls</h2>
        <p>You can export your full record, revoke provider access, or delete your account at any time from Settings.</p>
        <h2>Contact</h2>
        <p>Questions? Write to privacy@healthos.ai.</p>
      </div>
    </SimplePage>
  );
}