ALTER TABLE public.gallery_images
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false;

-- Replace public SELECT policy to only expose published rows
DROP POLICY IF EXISTS "Public can view gallery images" ON public.gallery_images;
CREATE POLICY "Public can view published gallery images"
  ON public.gallery_images FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Admins can view all rows regardless of published state
CREATE POLICY "Admins can view all gallery images"
  ON public.gallery_images FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));