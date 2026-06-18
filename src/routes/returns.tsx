import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [{ title: "Return Policy — Alburj Fragrance" }, { name: "description", content: "Alburj return policy: 7-day window for sealed bottles, hygiene exceptions, and refund timelines." }, { property: "og:url", content: "/returns" }],
    links: [{ rel: "canonical", href: "/returns" }],
  }),
  component: () => (
    <LegalPage eyebrow="Our Promise" title="Return Policy" sections={[
      { heading: "7-Day Return Window", body: <p>Unopened, sealed bottles may be returned within 7 days of delivery. Please contact our concierge before sending anything back.</p> },
      { heading: "Hygiene Exclusions", body: <p>For hygiene and authenticity reasons, opened, sprayed or used bottles cannot be returned or refunded.</p> },
      { heading: "Damaged or Wrong Items", body: <p>If your order arrives damaged or incorrect, message us within 48 hours with photographs and we will replace it at our expense.</p> },
      { heading: "Refund Timelines", body: <p>Approved refunds are issued to the original payment method within 7 business days of receiving the returned item.</p> },
    ]} />
  ),
});
