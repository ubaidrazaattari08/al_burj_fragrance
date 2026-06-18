import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [{ title: "Shipping Policy — Alburj Fragrance" }, { name: "description", content: "Alburj shipping policy: same-day Lahore delivery, nationwide Pakistan delivery and international shipping." }, { property: "og:url", content: "/shipping" }],
    links: [{ rel: "canonical", href: "/shipping" }],
  }),
  component: () => (
    <LegalPage eyebrow="Discreet Delivery" title="Shipping Policy" sections={[
      { heading: "Lahore", body: <p>Same-day delivery for orders placed before 2 PM. Standard fee: PKR 250. Free over PKR 7,500.</p> },
      { heading: "Pakistan (Nationwide)", body: <p>1–3 business days to major cities (Karachi, Islamabad, Rawalpindi, Multan, Faisalabad). 3–5 business days elsewhere. Standard fee: PKR 350. Free over PKR 7,500.</p> },
      { heading: "International", body: <p>Available on request via WhatsApp. Rates and timelines vary by destination.</p> },
      { heading: "Packaging", body: <p>Every bottle ships in our gold-stamped Maison Alburj box, wrapped in tissue, sealed with wax. Discreet outer packaging on request.</p> },
    ]} />
  ),
});
