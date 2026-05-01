import { createFileRoute } from "@tanstack/react-router";
import { ExperienceDetailPage } from "@/components/site/ExperienceDetailPage";
import { ifrsClients } from "@/data/experienceClients";

export const Route = createFileRoute("/experience/consultancy-services")({
  component: () => (
    <ExperienceDetailPage
      title="Consultancy Services Offered"
      clients={ifrsClients}
    />
  ),
  head: () => ({
    meta: [
      { title: "Consultancy Services Offered — MATED Institute" },
      {
        name: "description",
        content:
          "Strategic business advisory and financial consultancy services delivered across industries in Ethiopia.",
      },
      { property: "og:title", content: "Consultancy Services Offered | MATED Institute" },
      {
        property: "og:description",
        content:
          "Selected client engagements across financial management, system setup and advisory consultancy.",
      },
    ],
  }),
});
