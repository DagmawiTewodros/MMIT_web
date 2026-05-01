import { createFileRoute } from "@tanstack/react-router";
import { ExperienceDetailPage } from "@/components/site/ExperienceDetailPage";
import { ifrsClients } from "@/data/experienceClients";

export const Route = createFileRoute("/experience/ifrs-for-smes")({
  component: () => (
    <ExperienceDetailPage
      title="IFRS for SMEs Consultancy Services"
      clients={ifrsClients}
    />
  ),
  head: () => ({
    meta: [
      { title: "IFRS for SMEs Consultancy Services — MATED Institute" },
      {
        name: "description",
        content:
          "MATED's IFRS for SMEs implementation, conversion and advisory engagements across industries in Ethiopia.",
      },
      { property: "og:title", content: "IFRS for SMEs Consultancy Services | MATED Institute" },
      {
        property: "og:description",
        content:
          "Selected client engagements for IFRS for SMEs accounting & financial system setup, implementation and conversion.",
      },
    ],
  }),
});
