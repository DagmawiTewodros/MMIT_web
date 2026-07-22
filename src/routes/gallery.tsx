import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { GalleryCarousel } from "@/components/site/GalleryCarousel";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import beuDelivery from "@/assets/gallery/training-beu-delivery.jpg";
import hotelSession from "@/assets/gallery/training-hotel-session.jpg";
import classroom from "@/assets/gallery/training-classroom.jpg";
import certGroup from "@/assets/gallery/certification-group.jpg";
import minda from "@/assets/gallery/training-minda.jpg";
import certCeremony from "@/assets/gallery/certification-ceremony.jpg";
import assetField from "@/assets/gallery/asset-valuation-fieldwork.jpg";

const ORANGE = "#1C2841";

type Album = {
  id: string;
  images: { id: string; src: string }[];
  title: string;
  category: string;
  description?: string | null;
};

const defaultAlbums: Album[] = [
  {
    id: "d1",
    images: [{ id: "d1-image", src: beuDelivery }],
    title: "Beu Delivery — Certification",
    category: "Corporate Training",
  },
  {
    id: "d2",
    images: [{ id: "d2-image", src: hotelSession }],
    title: "Executive Training Session",
    category: "Workshops",
  },
  {
    id: "d3",
    images: [{ id: "d3-image", src: classroom }],
    title: "IFRS Classroom Training",
    category: "Workshops",
  },
  {
    id: "d4",
    images: [{ id: "d4-image", src: certGroup }],
    title: "Group Certification Program",
    category: "Certifications",
  },
  {
    id: "d5",
    images: [{ id: "d5-image", src: minda }],
    title: "Minda Business Group Training",
    category: "Corporate Training",
  },
  {
    id: "d6",
    images: [{ id: "d6-image", src: certCeremony }],
    title: "Certification Ceremony",
    category: "Certifications",
  },
  {
    id: "d7",
    images: [{ id: "d7-image", src: assetField }],
    title: "Asset Valuation Fieldwork",
    category: "Consultancy",
  },
];

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Gallery — MATED Institute" },
      {
        name: "description",
        content:
          "Highlights from MATED Institute's trainings, certifications, and consultancy engagements across Ethiopia.",
      },
      { property: "og:title", content: "Gallery | MATED Institute" },
      {
        property: "og:description",
        content:
          "A visual record of our accomplished trainings, certifications and consultancy fieldwork.",
      },
    ],
  }),
});

function GalleryPage() {
  const [active, setActive] = useState<number | null>(null);
  const [uploaded, setUploaded] = useState<Album[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select(
          "id, image_url, title, category, description, gallery_album_images(id, image_url, sort_order)",
        )
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) return;
      setUploaded(
        (data ?? []).map((album) => {
          const slides = [...(album.gallery_album_images ?? [])]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((image) => ({ id: image.id, src: image.image_url }));
          return {
            id: album.id,
            images: slides.length ? slides : [{ id: `${album.id}-legacy`, src: album.image_url }],
            title: album.title ?? "Untitled",
            category: album.category ?? "Gallery",
            description: album.description,
          };
        }),
      );
    })();
  }, []);

  const albums = [...uploaded, ...defaultAlbums];
  const activeAlbum = active === null ? null : albums[active];

  return (
    <SiteShell>
      <section className="bg-muted/40 pt-24 pb-10 sm:pt-32 sm:pb-12 md:pt-40 md:pb-16">
        <div className="container-editorial text-center">
          <h6
            className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] sm:mb-3 sm:text-xs sm:tracking-[0.25em]"
            style={{ color: ORANGE }}
          >
            Our Work
          </h6>
          <h1 className="mb-3 font-display text-2xl font-semibold sm:mb-4 sm:text-3xl md:text-5xl">
            Accomplished <span style={{ color: ORANGE }}>Works</span>
          </h1>
          <p className="mx-auto max-w-2xl px-2 text-sm text-foreground/70 sm:text-base">
            A glimpse into our trainings, certification ceremonies and consultancy engagements with
            partner organizations across Ethiopia.
          </p>
        </div>
      </section>
      <section className="bg-background py-10 sm:py-16 md:py-20">
        <div className="container-editorial">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {albums.map((album, index) => (
              <button
                key={album.id}
                onClick={() => setActive(index)}
                className="group relative block w-full overflow-hidden rounded-lg bg-muted text-left"
                style={{ boxShadow: "0 5px 15px rgba(0,0,0,0.06)" }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={album.images[0].src}
                    alt={album.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-opacity sm:opacity-0 sm:group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white transition-all sm:translate-y-2 sm:p-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                  <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
                    {album.category}
                  </p>
                  <h3 className="font-display text-base font-semibold leading-tight sm:text-lg">
                    {album.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      {activeAlbum && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <figure className="w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <GalleryCarousel images={activeAlbum.images} alt={activeAlbum.title} />
            <figcaption className="mt-4 text-center text-white">
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
                {activeAlbum.category}
              </p>
              <p className="font-display text-lg">{activeAlbum.title}</p>
              {activeAlbum.description && (
                <p className="mx-auto mt-2 max-w-2xl text-sm text-white/80">
                  {activeAlbum.description}
                </p>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </SiteShell>
  );
}
