import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type GalleryCarouselProps = {
  images: { id: string; src: string }[];
  alt: string;
};

export function GalleryCarousel({ images, alt }: GalleryCarouselProps) {
  const [viewportRef, api] = useEmblaCarousel({ loop: images.length > 1 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!api) return;
    const updateSelected = () => setSelectedIndex(api.selectedScrollSnap());
    updateSelected();
    api.on("select", updateSelected);
    api.on("reInit", updateSelected);
    return () => {
      api.off("select", updateSelected);
      api.off("reInit", updateSelected);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !hasMultipleImages || paused) return;
    timer.current = window.setInterval(() => api.scrollNext(), 4500);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [api, hasMultipleImages, paused]);

  if (!images.length) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded" ref={viewportRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div className="min-w-0 shrink-0 grow-0 basis-full" key={image.id}>
              <img
                src={image.src}
                alt={alt}
                loading={index === 0 ? "eager" : "lazy"}
                className="w-full max-h-[80vh] object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="mt-3 flex justify-center gap-2" aria-label="Choose image">
            {images.map((image, index) => (
              <button
                type="button"
                key={image.id}
                onClick={() => api?.scrollTo(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${index === selectedIndex ? "bg-white" : "bg-white/40 hover:bg-white/70"}`}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === selectedIndex ? "true" : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
