import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { X } from "lucide-react";
import beuDelivery from "@/assets/gallery/training-beu-delivery.jpg";
import hotelSession from "@/assets/gallery/training-hotel-session.jpg";
import classroom from "@/assets/gallery/training-classroom.jpg";
import certGroup from "@/assets/gallery/certification-group.jpg";
import minda from "@/assets/gallery/training-minda.jpg";
import certCeremony from "@/assets/gallery/certification-ceremony.jpg";
import assetField from "@/assets/gallery/asset-valuation-fieldwork.jpg";

const ORANGE = "#ff6b35";
const DARK_RED = "#b71c1c";

const items = [
  { src: beuDelivery, title: "Beu Delivery — Certification", category: "Corporate Training" },
  { src: hotelSession, title: "Executive Training Session", category: "Workshops" },
  { src: classroom, title: "IFRS Classroom Training", category: "Workshops" },
  { src: certGroup, title: "Group Certification Program", category: "Certifications" },
  { src: minda, title: "Minda Business Group Training", category: "Corporate Training" },
  { src: certCeremony, title: "Certification Ceremony", category: "Certifications" },
  { src: assetField, title: "Asset Valuation Fieldwork", category: "Consultancy" },
];

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Gallery — MATED Institute" },
      { name: "description", content: "Highlights from MATED Institute's trainings, certifications, and consultancy engagements across Ethiopia." },
      { property: "og:title", content: "Gallery | MATED Institute" },
      { property: "og:description", content: "A visual record of our accomplished trainings, certifications and consultancy fieldwork." },
    ],
  }),
});

function GalleryPage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <SiteShell>
      <section className="pt-24 sm:pt-32 md:pt-40 pb-10 sm:pb-12 md:pb-16 bg-muted/40">
        <div className="container-editorial text-center">
          <h6 className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-medium mb-2 sm:mb-3" style={{ color: ORANGE }}>
            Our Work
          </h6>
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-semibold mb-3 sm:mb-4">
            Accomplished <span style={{ color: ORANGE }}>Works</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-foreground/70 px-2">
            A glimpse into our trainings, certification ceremonies and consultancy
            engagements with partner organizations across Ethiopia.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16 md:py-20 bg-background">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items.map((it, idx) => (
              <button
                key={it.title}
                onClick={() => setActive(idx)}
                className="group relative overflow-hidden rounded-lg bg-muted text-left w-full"
                style={{ boxShadow: "0 5px 15px rgba(0,0,0,0.06)" }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={it.src}
                    alt={it.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Always-visible caption on mobile, hover on desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white sm:translate-y-2 sm:group-hover:translate-y-0 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                  <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
                    {it.category}
                  </p>
                  <h3 className="font-display text-base sm:text-lg font-semibold leading-tight">{it.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {active !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={items[active].src}
              alt={items[active].title}
              className="w-full max-h-[80vh] object-contain rounded"
            />
            <figcaption className="text-center text-white mt-4">
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
                {items[active].category}
              </p>
              <p className="font-display text-lg" style={{ color: "white" }}>
                {items[active].title}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </SiteShell>
  );
}
