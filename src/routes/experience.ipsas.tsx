import { createFileRoute } from "@tanstack/react-router";
import { ExperienceDetailPage } from "@/components/site/ExperienceDetailPage";
import { ipsasClients } from "@/data/experienceClients";

export const Route = createFileRoute("/experience/ipsas")({
  component: () => (
    <ExperienceDetailPage
      title="IPSAS Consultancy Services"
      clients={ipsasClients}
    />
  ),
  head: () => ({
    meta: [
      { title: "IPSAS Consultancy Services — MATED Institute" },
      {
        name: "description",
        content:
          "IPSAS implementation and conversion consultancy services delivered to public sector and NGO clients.",
      },
      { property: "og:title", content: "IPSAS Consultancy Services | MATED Institute" },
      {
        property: "og:description",
        content:
          "Selected NGO and public sector engagements for IPSAS based accounting and financial system setup.",
      },
    ],
  }),
});
