import { createFileRoute } from "@tanstack/react-router";
import { ExperienceDetailPage } from "@/components/site/ExperienceDetailPage";
import { ifrsClients } from "@/data/experienceClients";

export const Route = createFileRoute("/experience/training")({
  component: () => (
    <ExperienceDetailPage
      title="Training — IFRS, IPSAS, Asset Valuation & Others"
      clients={ifrsClients}
    />
  ),
  head: () => ({
    meta: [
      { title: "Training — IFRS, IPSAS, Asset Valuation & Others | MATED Institute" },
      {
        name: "description",
        content:
          "Professional training programs in IFRS, IPSAS, asset valuation and related disciplines for finance professionals.",
      },
      { property: "og:title", content: "Training — IFRS, IPSAS, Asset Valuation & Others | MATED Institute" },
      {
        property: "og:description",
        content:
          "Selected client engagements for hands-on workshops and certification courses in IFRS, IPSAS and asset valuation.",
      },
    ],
  }),
});
