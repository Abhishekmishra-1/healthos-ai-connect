import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/simple-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — HealthOS AI" },
      { name: "description", content: "The terms that govern your use of HealthOS AI." },
      { property: "og:title", content: "HealthOS AI Terms" },
      { property: "og:description", content: "The terms that govern your use of HealthOS AI." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <SimplePage eyebrow="Legal" title={<>Terms of <span className="gradient-brand-text">Service</span></>}
      description="Please read these terms carefully before using HealthOS AI.">
      <div className="prose prose-neutral mt-10 max-w-none text-foreground/85">
        <h2>Acceptance</h2>
        <p>By using HealthOS AI, you agree to these terms. If you do not agree, please do not use the service.</p>
        <h2>Not medical advice</h2>
        <p>HealthOS AI is a technology platform. The AI assistant is a helpful guide but not a replacement for a licensed doctor. Always consult a professional for diagnosis and treatment.</p>
        <h2>Payments</h2>
        <p>Membership fees are billed monthly and are non-refundable except as required by law. You may cancel any time.</p>
        <h2>Partner services</h2>
        <p>Medicines, consultations, and lab tests are delivered by licensed partners. HealthOS facilitates the connection and holds partners to strict quality standards.</p>
        <h2>Contact</h2>
        <p>Questions? Write to legal@healthos.ai.</p>
      </div>
    </SimplePage>
  );
}