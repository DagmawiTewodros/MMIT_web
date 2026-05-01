import { createFileRoute } from "@tanstack/react-router";
import { ExperienceDetailPage } from "@/components/site/ExperienceDetailPage";
import { assetValuationClients } from "@/data/experienceClients";

export const Route = createFileRoute("/experience/asset-valuation")({
  component: () => (
    <ExperienceDetailPage
      title="Asset Valuation & Revaluation Consultancy Services"
      clients={assetValuationClients}
    />
  ),
  head: () => ({
    meta: [
      { title: "Asset Valuation & Revaluation Consultancy — MATED Institute" },
      {
        name: "description",
        content:
          "Independent asset valuation and revaluation consultancy services for industries, hospitals, hotels, NGOs and government entities.",
      },
      { property: "og:title", content: "Asset Valuation & Revaluation Consultancy | MATED Institute" },
      {
        property: "og:description",
        content:
          "Selected client engagements for tangible and intangible asset valuation and revaluation.",
      },
    ],
  }),
});
