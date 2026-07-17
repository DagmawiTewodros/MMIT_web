
-- Gallery images: table for metadata + storage RLS
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE,
  image_url text NOT NULL,
  title text,
  category text,
  sort_order int NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gallery images"
  ON public.gallery_images FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert gallery images"
  ON public.gallery_images FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery images"
  ON public.gallery_images FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery images"
  ON public.gallery_images FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage RLS for gallery-images bucket
-- Anyone can view files (bucket is private but we use signed URLs; also allow SELECT so signed URLs and listing work)
CREATE POLICY "Public can read gallery-images objects"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'gallery-images');

CREATE POLICY "Admins can upload gallery-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery-images' AND public.has_role(auth.uid(), 'admin'));
