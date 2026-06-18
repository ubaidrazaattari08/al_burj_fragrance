import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Privacy Policy — Alburj Fragrance" }, { name: "description", content: "How Alburj Fragrance collects, uses and protects your personal information." }, { property: "og:url", content: "/privacy" }],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <LegalPage eyebrow="Trust & Care" title="Privacy Policy" sections={[
      { heading: "Information We Collect", body: <p>We collect the information you provide when placing an order: name, shipping address, phone number, and email. We also collect anonymous browsing data via cookies to improve the storefront.</p> },
      { heading: "How We Use It", body: <p>Order fulfilment, customer support, delivery updates, and (with your consent) marketing emails. We never sell your data to third parties.</p> },
      { heading: "Data Sharing", body: <p>We share order details only with our shipping partners (TCS, Leopards) to deliver your fragrances, and with payment processors for transaction completion.</p> },
      { heading: "Your Rights", body: <p>You may request access, correction, or deletion of your data at any time by writing to concierge@alburj.com.</p> },
      { heading: "Security", body: <p>All personal data is stored encrypted. Payment information is processed by certified gateways and never stored on our servers.</p> },
    ]} />
  ),
});
