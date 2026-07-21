import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Gallery — MATED Institute" },
      {
        name: "description",
        content: "Gallery of MATED Institute's work and engagements across Ethiopia.",
      },
      { property: "og:title", content: "Gallery | MATED Institute" },
    ],
  }),
});

function GalleryPage() {
  return <SiteShell>{null}</SiteShell>;
}
