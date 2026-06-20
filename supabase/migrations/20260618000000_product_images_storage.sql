-- =====================================================================
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view product images (public bucket, since they show on the storefront)
CREATE POLICY "product images public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Only admins can upload new product images
CREATE POLICY "product images admin insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Only admins can update/replace product images
CREATE POLICY "product images admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Only admins can delete product images
CREATE POLICY "product images admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
