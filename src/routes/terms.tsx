import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms & Conditions — Alburj Fragrance" }, { name: "description", content: "Terms and conditions governing the use of alburj.com and purchases from Alburj Fragrance." }, { property: "og:url", content: "/terms" }],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalPage eyebrow="The Fine Print" title="Terms & Conditions" sections={[
      { heading: "Acceptance", body: <p>By using this site or placing an order, you accept these terms. We may update them periodically; the latest version always applies.</p> },
      { heading: "Orders & Pricing", body: <p>All prices are in PKR and inclusive of applicable taxes. We reserve the right to refuse or cancel any order at our discretion.</p> },
      { heading: "Intellectual Property", body: <p>The Alburj name, logo, packaging design, fragrance names and all site content are the exclusive property of Maison Alburj.</p> },
      { heading: "Limitation of Liability", body: <p>We are not liable for individual reactions to fragrance ingredients. Please test on a small area of skin first if you have known sensitivities.</p> },
      { heading: "Governing Law", body: <p>These terms are governed by the laws of the Islamic Republic of Pakistan.</p> },
    ]} />
  ),
});
