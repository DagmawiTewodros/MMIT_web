import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { X, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import beuDelivery from "@/assets/gallery/training-beu-delivery.jpg";
import hotelSession from "@/assets/gallery/training-hotel-session.jpg";
import classroom from "@/assets/gallery/training-classroom.jpg";
import certGroup from "@/assets/gallery/certification-group.jpg";
import minda from "@/assets/gallery/training-minda.jpg";
import certCeremony from "@/assets/gallery/certification-ceremony.jpg";
import assetField from "@/assets/gallery/asset-valuation-fieldwork.jpg";

const ORANGE = "#ff6b35";

const IMAGE_SIGN_EXPIRY = 60 * 60 * 24 * 365 * 10;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type Item = {
  id: string;
  src: string;
  title: string;
  category: string;
  storage_path?: string;
  is_default?: boolean;
};

const defaultItems: Item[] = [
  { id: "d1", src: beuDelivery, title: "Beu Delivery — Certification", category: "Corporate Training", is_default: true },
  { id: "d2", src: hotelSession, title: "Executive Training Session", category: "Workshops", is_default: true },
  { id: "d3", src: classroom, title: "IFRS Classroom Training", category: "Workshops", is_default: true },
  { id: "d4", src: certGroup, title: "Group Certification Program", category: "Certifications", is_default: true },
  { id: "d5", src: minda, title: "Minda Business Group Training", category: "Corporate Training", is_default: true },
  { id: "d6", src: certCeremony, title: "Certification Ceremony", category: "Certifications", is_default: true },
  { id: "d7", src: assetField, title: "Asset Valuation Fieldwork", category: "Consultancy", is_default: true },
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
  const auth = useAdminAuth();
  const isAdmin = auth.status === "admin";
  const [active, setActive] = useState<number | null>(null);
  const [uploaded, setUploaded] = useState<Item[]>([]);
  const [uploading, setUploading] = useState(false);

  const items: Item[] = [...uploaded, ...defaultItems];

  const loadUploaded = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("id, image_url, title, category, storage_path")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return;
    setUploaded(
      (data ?? []).map((r) => ({
        id: r.id,
        src: r.image_url,
        title: r.title ?? "Untitled",
        category: r.category ?? "Gallery",
        storage_path: r.storage_path,
      })),
    );
  };

  useEffect(() => {
    loadUploaded();
  }, []);

  const onUpload = async (file: File) => {
    if (!isAdmin) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG or WEBP images are allowed");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be 5MB or smaller");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("gallery-images")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data: signed, error: signErr } = await supabase.storage
        .from("gallery-images")
        .createSignedUrl(path, IMAGE_SIGN_EXPIRY);
      if (signErr || !signed) throw signErr ?? new Error("Failed to sign URL");
      const title = window.prompt("Image title (optional)", "") || "Untitled";
      const category = window.prompt("Category (optional)", "Gallery") || "Gallery";
      const { error: insErr } = await supabase.from("gallery_images").insert({
        storage_path: path,
        image_url: signed.signedUrl,
        title,
        category,
      });
      if (insErr) throw insErr;
      toast.success("Image added");
      await loadUploaded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (it: Item) => {
    if (!isAdmin || it.is_default) return;
    if (!confirm(`Delete "${it.title}"?`)) return;
    try {
      if (it.storage_path) {
        await supabase.storage.from("gallery-images").remove([it.storage_path]);
      }
      const { error } = await supabase.from("gallery_images").delete().eq("id", it.id);
      if (error) throw error;
      toast.success("Image deleted");
      await loadUploaded();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

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

          {isAdmin && (
            <div className="mt-6 flex items-center justify-center">
              <label className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium cursor-pointer hover:bg-primary/90 transition disabled:opacity-60">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading…" : "Add Image"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUpload(f);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </section>

      <section className="py-10 sm:py-16 md:py-20 bg-background">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {items.map((it, idx) => (
              <div key={it.id} className="relative group">
                <button
                  onClick={() => setActive(idx)}
                  className="relative overflow-hidden rounded-lg bg-muted text-left w-full block"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white sm:translate-y-2 sm:group-hover:translate-y-0 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                    <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
                      {it.category}
                    </p>
                    <h3 className="font-display text-base sm:text-lg font-semibold leading-tight">{it.title}</h3>
                  </div>
                </button>
                {isAdmin && !it.is_default && (
                  <button
                    onClick={() => onDelete(it)}
                    className="absolute top-2 right-2 inline-flex items-center justify-center h-9 w-9 rounded-full bg-destructive text-destructive-foreground shadow-lg hover:scale-105 transition z-10"
                    aria-label={`Delete ${it.title}`}
                    title="Delete image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {active !== null && items[active] && (
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
