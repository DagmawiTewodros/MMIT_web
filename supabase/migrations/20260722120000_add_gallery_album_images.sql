-- Keep gallery_images as the album record. Its existing image remains the cover
-- and is copied below as the first slide for every legacy album.
CREATE TABLE public.gallery_album_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES public.gallery_images(id) ON DELETE CASCADE,
  storage_path text NOT NULL UNIQUE,
  image_url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX gallery_album_images_gallery_order_idx
  ON public.gallery_album_images (gallery_id, sort_order, created_at);

CREATE TRIGGER update_gallery_album_images_updated_at
  BEFORE UPDATE ON public.gallery_album_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT ON public.gallery_album_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_album_images TO authenticated;
GRANT ALL ON public.gallery_album_images TO service_role;

ALTER TABLE public.gallery_album_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published gallery album images"
  ON public.gallery_album_images FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.gallery_images
      WHERE gallery_images.id = gallery_album_images.gallery_id
        AND gallery_images.published = true
    )
  );

CREATE POLICY "Admins can view gallery album images"
  ON public.gallery_album_images FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert gallery album images"
  ON public.gallery_album_images FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery album images"
  ON public.gallery_album_images FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery album images"
  ON public.gallery_album_images FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Every legacy one-image album becomes a valid one-slide album.
INSERT INTO public.gallery_album_images (gallery_id, storage_path, image_url, sort_order)
SELECT id, storage_path, image_url, 0
FROM public.gallery_images;
